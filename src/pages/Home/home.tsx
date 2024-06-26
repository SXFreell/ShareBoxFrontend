import { Alert, Button, DatePicker, Input, InputNumber, Radio, Select, Space, Tag, Typography, Message } from "@arco-design/web-react"
import { useEffect, useState } from "react"
import './home.less'
import { NavigateFunction, useLocation, useNavigate } from "react-router-dom";
import instance from "@/net/axios.tsx";

interface MaxAndMin {
    max: number,
    min: number
}

interface DateMaxAndMin {
    years: MaxAndMin,
    months: MaxAndMin,
    days: MaxAndMin,
    hours: MaxAndMin,
    minutes: MaxAndMin,
    seconds: MaxAndMin
}

interface CodeListItem {
    code: string | null,
    content: string,
    status: CodeListItemStatus,
}

type ExpiresType = 'never-expires' | 'expiration-time' | 'countdown' | 'pickup-count'
type CountDateType = 'years' | 'months' | 'days' | 'hours' | 'minutes' | 'seconds'
type CodeListItemStatus = 'success' | 'error'

const { Text } = Typography;

const useQuery = () => {
    return new URLSearchParams(useLocation().search);
}

const disabledDate = (current: any) => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return current && current < now;
}

const dateMaxAndMin: DateMaxAndMin = {
    years: {max: 100, min: 1},
    months: {max: 1200, min: 1},
    days: {max: 36500, min: 1},
    hours: {max: 24*36500, min: 1},
    minutes: {max: 60*24*36500, min: 1},
    seconds: {max: 60*60*24*36500, min: 1}
}

const verCode: Function = (code: string, get: boolean = false): boolean => {
    // 以一位大小写字母开头，0个或多个数字结尾，数字不超过5个
    if (code.length === 0) return true;
    const reg = get ? /^[a-zA-Z]\d{5}$/ : /^[a-zA-Z]\d{0,5}$/;
    return reg.test(code);
}

const transTimestamp: Function = (
    expiresType: ExpiresType,
    countDateType: CountDateType,
    countDate: number,
    date: number
): number => {
    switch (expiresType) {
        case 'never-expires':
            return -1;
        case 'expiration-time':
            return date / 1000;
        case 'countdown':
            const timestamp = Date.now();
            switch (countDateType) {
                case 'years':
                    return (timestamp + 1000 * 60 * 60 * 24 * 365 * countDate) / 1000;
                case 'months':
                    return (timestamp + 1000 * 60 * 60 * 24 * 30 * countDate) / 1000;
                case 'days':
                    return (timestamp + 1000 * 60 * 60 * 24 * countDate) / 1000;
                case 'hours':
                    return (timestamp + 1000 * 60 * 60 * countDate) / 1000;
                case 'minutes':
                    return (timestamp + 1000 * 60 * countDate) / 1000;
                case 'seconds':
                    return (timestamp + 1000 * countDate) / 1000;
            }
            break;
        case 'pickup-count':
            return -1;
    }
    return -1;
}

const handleOpenCode = (code: string) => {
    console.log(code)
    window.open(`/?code=${code}`)
}

const Home = () => {
    const query = useQuery();
    const navigate: NavigateFunction = useNavigate();

    const [doWhat, setDoWhat] = useState<string>('get');

    // Get
    const [code, setCode] = useState<string>('');
    const [getTextFile, setGetTextFile] = useState<string>('')

    // Set
    const [expiresType, setExpiresType] = useState<ExpiresType>('never-expires')
    const [expirationTime, setExpirationTime] = useState<number>(Date.now())
    const [countDateType, setCountDateType] = useState<CountDateType>('days')
    const [countDate, setCountDate] = useState<number>(1)
    const [pickupCount, setPickupCount] = useState<number>(1)
    const [textFile, setTextFile] = useState<string>('')

    const [codeList, setCodeList] = useState<CodeListItem[]>([])

    const handleGetTextFile = (preCode?: string) => {
        const latestCode = preCode || code;
        if (!verCode(latestCode, true)) {
            Message.error({
                closable: true,
                content: '取件码格式错误'
            })
            return;
        }
        instance.post('/get', {
            code: latestCode
        }).then((res: any) => {
            if (res.data.code === 20000) { 
                setGetTextFile(res.data.data.content)
                Message.success({
                    duration: 1500,
                    closable: true,
                    content: '取件成功'
                })
            } else {
                Message.error({
                    closable: true,
                    content: '取件码不存在'
                })
            }
        }).catch((err: any) => {
            console.log(err)
        })
    }

    const handleSaveTextFile = () => {
        if (textFile.length === 0) {
            Message.error({
                closable: true,
                content: '内容不能为空'
            })
            return;
        }
        instance.post('/set', {
            type: 'TEXT',
            set_text_content: {
                content: textFile,
                expires: Math.trunc(transTimestamp(expiresType, countDateType, countDate, expirationTime)),
                pickup_count: expiresType === 'pickup-count' ? pickupCount : -1
            }
        }).then((res: any) => {
            setCodeList([...codeList, {
                code: res.data.code,
                content: textFile,
                status: 'success'
            }])
            Message.success({
                closable: true,
                duration: 1500,
                content: '保存成功'
            })
        }).catch((err: any) => {
            setCodeList([...codeList, {
                code: null,
                content: textFile,
                status: 'error'
            }])
            console.log(err)
        })
    }

    useEffect(() => {
        const getCode: string | null = query.get('code');
        if (getCode !== null && code !== getCode) {
            if (verCode(getCode, true)) {
                setCode(getCode)
                handleGetTextFile(getCode)
            } else {
                navigate('/')
            }
        }
    }, [])

    return (
        <Space className={['space-padding', 'width-100']} direction="vertical" align="start">
            <Radio.Group
                type="button"
                defaultValue={'get'}
                value={doWhat}
                name="do-what"
                onChange={(e: 'set'|'get') => { setDoWhat(e) }}
            >
                <Radio value={'get'}>取</Radio>
                <Radio value={'set'}>存</Radio>
            </Radio.Group>
            {
                doWhat === 'get' ?
                    <Space className={'width-100'} direction="vertical" align="start">
                        <Input
                            className={"arco-input-group-suffix-button-custom"}
                            prefix="取件码"
                            suffix={<Button size="default" onClick={() => {handleGetTextFile()} }>取文件</Button>}
                            value={code}
                            onInput={(e: any) => {
                                verCode(e.target.value)
                                    && setCode(e.target.value)
                            }}
                        ></Input>
                        <Input.TextArea
                            autoSize={{minRows: 3, maxRows: 10}}
                            maxLength={200000}
                            showWordLimit
                            value={getTextFile}
                        />
                    </Space> :
                    <Space className={'width-100'} direction="vertical" align="start">
                        <Space className={['date-picker-space' ,'width-100']}>
                            <Select
                                defaultValue={"never-expires"}
                                value={expiresType}
                                onChange={(value: any) => {setExpiresType(value)}}
                                style={{width: 100}}
                            >
                                <Select.Option value={"never-expires"}>永不过期</Select.Option>
                                <Select.Option value={"expiration-time"}>过期时间</Select.Option>
                                <Select.Option value={"countdown"}>倒计时</Select.Option>
                                <Select.Option value={"pickup-count"}>取件次数</Select.Option>
                            </Select>
                            {
                                expiresType === 'expiration-time' ?
                                    <DatePicker
                                        className={'date-picker'}
                                        showTime
                                        placeholder="过期时间"
                                        disabledDate={disabledDate}
                                        value={expirationTime}
                                        onChange={(date: any) => {
                                            const timestamp = new Date(date).getTime();
                                            setExpirationTime(timestamp)
                                        }}
                                    /> :
                                expiresType === 'countdown' ?
                                    <div className={"date-picker-box"}>
                                        <InputNumber
                                            placeholder="倒计时"
                                            min={dateMaxAndMin[countDateType].min}
                                            max={dateMaxAndMin[countDateType].max}
                                            style={{marginRight: 8}}
                                            value={countDate}
                                            onChange={(value: any) => {setCountDate(value)}}
                                        /> 
                                        <Select
                                            defaultValue={"days"}
                                            value={countDateType}
                                            onChange={(value: any) => {
                                                setCountDateType(value)
                                                setCountDate(dateMaxAndMin[value as CountDateType].min)
                                            }}
                                            style={{width: 64}}
                                        >
                                            <Select.Option value={"years"}>年</Select.Option>
                                            <Select.Option value={"months"}>月</Select.Option>
                                            <Select.Option value={"days"}>天</Select.Option>
                                            <Select.Option value={"hours"}>时</Select.Option>
                                            <Select.Option value={"minutes"}>分</Select.Option>
                                            <Select.Option value={"seconds"}>秒</Select.Option>
                                        </Select>
                                    </div> :
                                expiresType === 'pickup-count' ?
                                    <InputNumber
                                        className={'date-picker'}
                                        placeholder="取件次数"
                                        min={1}
                                        max={99999}
                                        suffix={"次"}
                                        value={pickupCount}
                                        onChange={(value: any) => {setPickupCount(value)}}
                                    /> :
                                null
                            }
                        </Space>
                        <Input.TextArea
                            autoSize={{minRows: 3, maxRows: 10}}
                            maxLength={200000}
                            value={textFile}
                            onChange={(text: string) => {setTextFile(text)}}
                        />
                        <Button type="primary" onClick={handleSaveTextFile}>存文件</Button>
                        {
                            codeList.map((item: CodeListItem, index: number) => {
                                return <Alert
                                    key={`banner-code-${index}`}
                                    type={item.status}
                                    onClose={() => {
                                        setCodeList(codeList.filter(listItem => listItem.code !== item.code))
                                    }}
                                    title={
                                        <div className={'banner-code-title'}>
                                        {/* CODE: <a href={{`/?code=${item.code}`}} target='_blank'>{item.code}</a> */}
                                            CODE: {
                                                item.code === null ?
                                                    <Text className={"banner-code-description"} type="secondary">保存失败</Text> :
                                                    <span onClick={() => handleOpenCode(item.code || '')}><Tag checkable checked size="small" color='green'>{item.code}</Tag></span>
                                            }
                                        </div>
                                    }
                                    content={<Text className={"banner-code-description"} type="secondary">{item.content}</Text>}
                                />
                            })
                        }
                    </Space>
            }
            {/* <Button type="primary" onClick={handleClick}>查看当前选项</Button> */}

        </Space>
    )
}

export default Home

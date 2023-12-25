import { Banner, Button, DatePicker, Input, InputNumber, Radio, RadioGroup, Select, Space, TextArea, Toast, Typography } from "@douyinfe/semi-ui"
import { MouseEventHandler, useEffect, useState } from "react"
import styles from '@css/home.module.less'
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
type CodeListItemStatus = 'success' | 'danger'

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
            return date;
        case 'countdown':
            const timestamp = Date.now();
            switch (countDateType) {
                case 'years':
                    return timestamp + 1000 * 60 * 60 * 24 * 365 * countDate;
                case 'months':
                    return timestamp + 1000 * 60 * 60 * 24 * 30 * countDate;
                case 'days':
                    return timestamp + 1000 * 60 * 60 * 24 * countDate;
                case 'hours':
                    return timestamp + 1000 * 60 * 60 * countDate;
                case 'minutes':
                    return timestamp + 1000 * 60 * countDate;
                case 'seconds':
                    return timestamp + 1000 * countDate;
            }
            break;
        case 'pickup-count':
            return -1;
    }
    return -1;
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

    const handleGetTextFile: MouseEventHandler = () => {
        if (!verCode(code, true)) return;
        instance.post('/get', {
            code: code
        }).then((res: any) => {
            setGetTextFile(res.data.data.content)
            Toast.success({
                content: '取件成功'
            })
        }).catch((err: any) => {
            console.log(err)
        })
    }

    const handleSaveTextFile: MouseEventHandler = () => {
        if (textFile.length === 0) return;
        instance.post('/set', {
            type: 'TEXT',
            set_text_content: {
                content: textFile,
                expires: parseInt(transTimestamp(expiresType, countDateType, countDate, expirationTime)),
                pickup_count: expiresType === 'pickup-count' ? pickupCount : -1
            }
        }).then((res: any) => {
            setCodeList([...codeList, {
                code: res.data.code,
                content: textFile,
                status: 'success'
            }])
            Toast.success({
                content: '保存成功'
            })
        }).catch((err: any) => {
            setCodeList([...codeList, {
                code: null,
                content: textFile,
                status: 'danger'
            }])
            console.log(err)
        })
    }

    useEffect(() => {
        const getCode: string | null = query.get('code');
        if (getCode !== null && code !== getCode) {
            if (verCode(getCode, true)) {
                setCode(getCode)
            } else {
                navigate('/')
            }
        }
    }, [])

    return (
        <Space vertical align="start"  style={{width: '100%'}}>
            <RadioGroup
                type="button"
                defaultValue={'get'}
                value={doWhat}
                aria-label="存OR取"
                name="do-what"
                onChange={(e: any) => {
                    setDoWhat(e.target.value)
                }}
            >
                <Radio value={'get'}>取</Radio>
                <Radio value={'set'}>存</Radio>
            </RadioGroup>
            {
                doWhat === 'get' ?
                    <Space vertical align="start">
                        <Input
                            prefix="取件码"
                            suffix={<Button type="primary" onClick={ handleGetTextFile }>取文件</Button>}
                            value={code}
                            onInput={(e: any) => {
                                verCode(e.target.value)
                                    && setCode(e.target.value)
                            }}
                        ></Input>
                        <TextArea
                            autosize
                            maxCount={200000}
                            style={{width: '100%', maxWidth: 400}}
                            value={getTextFile}
                        />
                    </Space> :
                    <Space vertical align="start" style={{width: '100%'}}>
                        <Space>
                            <Select
                                defaultValue={"never-expires"}
                                value={expiresType}
                                onChange={(value: any) => {setExpiresType(value)}}
                                style={{width: 120}}
                            >
                                <Select.Option value={"never-expires"}>永不过期</Select.Option>
                                <Select.Option value={"expiration-time"}>过期时间</Select.Option>
                                <Select.Option value={"countdown"}>倒计时</Select.Option>
                                <Select.Option value={"pickup-count"}>取件次数</Select.Option>
                            </Select>
                            {
                                expiresType === 'expiration-time' ?
                                    <DatePicker
                                        type="dateTime"
                                        placeholder="过期时间"
                                        disabledDate={disabledDate}
                                        hideDisabledOptions
                                        value={expirationTime}
                                        onChange={(date: any) => {setExpirationTime(date)}}
                                    /> :
                                expiresType === 'countdown' ?
                                    <>
                                        <InputNumber
                                            placeholder="倒计时"
                                            innerButtons={true}
                                            min={dateMaxAndMin[countDateType].min}
                                            max={dateMaxAndMin[countDateType].max}
                                            style={{width: 200}}
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
                                    </> :
                                expiresType === 'pickup-count' ?
                                    <InputNumber
                                        placeholder="取件次数"
                                        min={1}
                                        max={99999}
                                        style={{width: 200}}
                                        suffix={"次"}
                                        value={pickupCount}
                                        onChange={(value: any) => {setPickupCount(value)}}
                                    /> :
                                null
                            }
                        </Space>
                        <TextArea
                            autosize
                            maxCount={200000}
                            style={{width: '100%', maxWidth: 400}}
                            value={textFile}
                            onChange={(text: string) => {setTextFile(text)}}
                        />
                        {
                            codeList.map((item: CodeListItem, index: number) => {
                                return <Banner
                                    key={`banner-code-${index}`}
                                    style={{width: 376}}
                                    fullMode={false}
                                    type={item.status}
                                    onClose={() => {
                                        setCodeList(codeList.filter(listItem => listItem.code !== item.code))
                                    }}
                                    title={
                                        <div className={styles['banner-code-title']}>
                                            CODE: <Text link={{href: `/?code=${item.code}`, target: '_blank'}}>{item.code}</Text>
                                        </div>
                                    }
                                    description={<Text className={styles["banner-code-description"]} type="tertiary">{item.content}</Text>}
                                />
                            })
                        }
                        <Button type="primary" onClick={handleSaveTextFile}>存文件</Button>
                    </Space>
            }
            {/* <Button type="primary" onClick={handleClick}>查看当前选项</Button> */}

        </Space>
    )
}

export default Home

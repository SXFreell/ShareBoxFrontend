import { Button, Input, Radio, RadioGroup, Space, TextArea } from "@douyinfe/semi-ui"
import { MouseEventHandler, useEffect, useState } from "react"
import '@css/home.less'
import { NavigateFunction, useLocation, useNavigate } from "react-router-dom";
import instance from "@/net/axios.tsx";

const useQuery = () => {
    return new URLSearchParams(useLocation().search);
}

const Home = () => {
    const query = useQuery();
    const getCode: string | null = query.get('code');
    const navigate: NavigateFunction = useNavigate()

    // useEffect(() => {
    //     navigate('/login')
    // })

    const [doWhat, setDoWhat] = useState<string>('get');
    const [code, setCode] = useState<string>('');
    const [textFile, setTextFile] = useState<string>('')
    const [getTextFile, setGetTextFile] = useState<string>('')

    // const handleClick: MouseEventHandler = () => {
    //     console.log('doWhat', doWhat)
    // }

    const verCode: Function = (code: string, get: boolean = false): boolean => {
        // 以一位大小写字母开头，0个或多个数字结尾，数字不超过5个
        if (code.length === 0) return true;
        const reg = get ? /^[a-zA-Z]\d{5}$/ : /^[a-zA-Z]\d{0,5}$/;
        return reg.test(code);
    }

    const handleGetTextFile: MouseEventHandler = () => {
        if (!verCode(code, true)) return;
        instance.post('/get', {
            code: code
        }).then((res: any) => {
            setGetTextFile(res.data.data.content)
            console.log(res)
        }).catch((err: any) => {
            console.log(err)
        })
    }

    const handleSaveTextFile: MouseEventHandler = () => {
        instance.post('/set', {
            type: 'TEXT',
            set_text_content: {
                content: textFile,
                expires: -1
            }
        }).then((res: any) => {
            console.log(res)
        }).catch((err: any) => {
            console.log(err)
        })
        // const blob = new Blob([textFile], {type: 'text/plain'})
        // const a = document.createElement('a')
        // a.download = 'text.txt'
        // a.href = URL.createObjectURL(blob)
        // a.click()
        // URL.revokeObjectURL(a.href)
    }

    useEffect(() => {
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
                        <TextArea
                            autosize
                            maxCount={200000}
                            style={{width: '100%', maxWidth: 400}}
                            value={textFile}
                            onChange={(text: string) => {setTextFile(text)}}
                        />
                        <Button type="primary" onClick={handleSaveTextFile}>存文件</Button>
                    </Space>
            }
            {/* <Button type="primary" onClick={handleClick}>查看当前选项</Button> */}

        </Space>
    )
}

export default Home

import { Result, Button } from '@arco-design/web-react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

import './404.module.less';

function NotFoundPage() {
    const navigate = useNavigate()
    const handleBackHome = () => {
        navigate('/')
    };

    return (
        <div className='not-found-page-content'>
            <Result
                status='404'
                subTitle='抱歉，我们似乎找不到您正在寻找的页面'
                extra={[
                    <Link key='back' to="/">
                        <Button onClick={handleBackHome} type='primary'>
                            返回首页
                        </Button>
                    </Link>,
                ]}
            />
            {/* <Empty
                image={<IllustrationNotFound style={{ width: 150, height: 150 }} />}
                darkModeImage={<IllustrationNotFoundDark style={{ width: 150, height: 150 }} />}
                title={'页面不存在'}
                description={'抱歉，我们似乎找不到您正在寻找的页面。'}
                style={emptyStyle}
            >
                <Link to="/">
                    <Button onClick={handleBackHome}>返回首页</Button>
                </Link>
            </Empty> */}
        </div>
    );
}

export default NotFoundPage;
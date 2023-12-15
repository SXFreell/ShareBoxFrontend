import { IllustrationNotFoundDark, IllustrationNotFound } from '@douyinfe/semi-illustrations';
import { Button, Empty } from '@douyinfe/semi-ui';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

import '@css/404.less';

function NotFoundPage() {
    const navigate = useNavigate()
    const handleBackHome = () => {
        navigate('/')
    };

    const emptyStyle = {
        padding: 20,
    }

    return (
        <div className='not-found-page-content'>
            <Empty
                image={<IllustrationNotFound style={{ width: 150, height: 150 }} />}
                darkModeImage={<IllustrationNotFoundDark style={{ width: 150, height: 150 }} />}
                title={'页面不存在'}
                description={'抱歉，我们似乎找不到您正在寻找的页面。'}
                style={emptyStyle}
            >
                <Link to="/">
                    <Button onClick={handleBackHome}>返回首页</Button>
                </Link>
            </Empty>
        </div>
    );
}

export default NotFoundPage;
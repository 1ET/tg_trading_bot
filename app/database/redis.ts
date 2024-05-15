import * as redis from 'redis'

const port_redis = process.env.PORT || 6379

const options = {
    legacyMode: true,
    url: 'redis://127.0.0.1:6379',
    password: 'ZUBNSFKSeH1s2VYiBj7ckUppnVAxhtqA54/dCpR2MSKnvnh3ZH6GdAyrPhlHI2EUUKJ3m6tJtcTlkWyt'
}

const redis_client = redis.createClient(options)

redis_client.on('connect', () => {
    console.log("Connected to Redis");
});
redis_client.on('error', err => {
    console.log('redis error: ' + err);
    rediseInit();
});

redis_client.on('ready', err => {
    console.log("redis is ready");
});

redis_client.on('end', err => {
    console.log("redis connection is ended");
});

//reconnecting
redis_client.on('reconnecting', err => {
    console.log("redis connection is reconnecting");
});

const rediseInit = async () => {
    console.log('init redis')
    await redis_client.connect();
}

async function checkCache(params: string) {
    console.log('缓存查询===>', params)
    //得到 key = id 的数据
    try {
        const data = await redis_client.get(params)
        console.log('缓存读取===>')
        if (data != null) {
            return data
        } else {
            return false
            //继续下一个中间件函数
        }
    } catch (err) {
        console.log(err);
        return false
    }
}

export { rediseInit, redis_client, checkCache };
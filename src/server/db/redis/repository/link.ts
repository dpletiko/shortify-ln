// src/server/db/redis/repository/link.ts
import redis from '../index'
import linkSchema, { Link } from '../../../../../redis/link';

type LinkRedisData = {
    ln: string,
    url: string,
}

const linkRepository = async () => (await redis)?.fetchRepository<Link>(linkSchema)

export const ping = async () => (await redis)?.execute(['PING']);

// If you want to the Repository.search method, 
// you need to create an index first, 
// and you need RediSearch or RedisJSON installed on your instance of Redis:
export const createIndex = async () => 
    await (await linkRepository())?.createIndex();


export const getLink = async (ln: string) => {
    console.log('getLink', ln)

    // await createIndex();

    return await (await linkRepository())
        ?.search()
        .where('ln')
        .eq(ln)
        .returnFirst();
};


export const createLink = async (data: LinkRedisData) => {
    console.log('createLink', data)

    return await (await linkRepository())?.createAndSave(data)
};


export const updateLink = async (data: LinkRedisData) => {
    console.log('updateLink', data.ln)

    await createIndex();
    const _link = await getLink(data.ln)

    console.log("searchUpdateLink", _link)

    // Create link if doesn't exist
    if(_link === null) {
        return await createLink(data);
    }

    // _link.ln = data.ln;
    // _link.url = data.url;
    // await (await linkRepository())?.save(_link);

    return _link;
};


export default linkRepository;
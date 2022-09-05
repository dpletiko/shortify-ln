// redis/links.ts
import { Entity, Schema } from 'redis-om'

// Typescript fix
// Create interface with same name as Entity
interface Link {
    ln: string;
    url: string;
}

// Create an Entity for Link
class Link extends Entity {}

// Create a Schema for Link
const linkSchema = new Schema(Link, {
    ln: { type: 'string', indexed: true },
    url: { type: 'string', indexed: false },
}, { 
    indexedDefault: true,
    dataStructure: 'JSON'
});

export default linkSchema;

export {
    Link
}
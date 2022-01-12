import {images} from "assets";

export interface Intro{
    id: number,
    image: any,
    title: string,
}

const ListIntro: Array<Intro> = [
    {
        id: 0,
        image: images.intro1,
        title: 'The new NFT marketplace',
    },
    {
        id: 1,
        image: images.intro2,
        title: 'Get success in the crypto art',
    },
    {
        id: 2,
        image: images.intro3,
        title: 'Stake to earn more money',
    }
]

export {
    ListIntro
}

import * as beet from '@metaplex-foundation/beet';
import { BotTax } from './BotTax';
import { Lamports } from './Lamports';
import { SplToken } from './SplToken';
import { LiveDate } from './LiveDate';
import { ThirdPartySigner } from './ThirdPartySigner';
import { Whitelist } from './Whitelist';
import { Gatekeeper } from './Gatekeeper';
import { EndSettings } from './EndSettings';
import { AllowList } from './AllowList';
import { MintLimit } from './MintLimit';
import { NftPayment } from './NftPayment';
export declare type GuardSet = {
    botTax: beet.COption<BotTax>;
    lamports: beet.COption<Lamports>;
    splToken: beet.COption<SplToken>;
    liveDate: beet.COption<LiveDate>;
    thirdPartySigner: beet.COption<ThirdPartySigner>;
    whitelist: beet.COption<Whitelist>;
    gatekeeper: beet.COption<Gatekeeper>;
    endSettings: beet.COption<EndSettings>;
    allowList: beet.COption<AllowList>;
    mintLimit: beet.COption<MintLimit>;
    nftPayment: beet.COption<NftPayment>;
};
export declare const guardSetBeet: beet.FixableBeetArgsStruct<GuardSet>;
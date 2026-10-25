// Bluesky accounts behind each publisher list's daily top 10, shown on the
// "Sources des brèves" page. Display names are curated; avatars are the
// Bluesky CDN URLs resolved once via public.api.bsky.app (stable, since they
// include the content hash).

export type SourceRow = {
  handle: string;
  displayName: string;
  avatar: string;
};

export type Sources = {
  list: 'fr' | 'coop-medias' | 'fr-coop-medias';
  // Completes "… proviennent des comptes Bluesky <origin>".
  origin: string;
  originLink?: { href: string; label: string };
  roster: SourceRow[];
};

// French press accounts, as fetched by the hourly worker. No account is in both
// this list and COOP_MEDIAS: the two lists are disjoint.
const FRENCH_MEDIA: SourceRow[] = [
  { handle: 'afp.com', displayName: 'Agence France-Presse', avatar: 'https://cdn.bsky.app/img/avatar/plain/did:plc:ffccycfh6c6pmxwkhvq5clkv/bafkreiadcsh7hzzurk5joh7bhxxlyqlvr26mg25f6dnozuwhsz72jz2cme' },
  { handle: 'bfmtv.com', displayName: 'BFMTV', avatar: 'https://cdn.bsky.app/img/avatar/plain/did:plc:wb4ovhhcrif6cp66oe2pqx7i/bafkreic3fjfw4c2hbqailogxb2nusnspddwczt5bhyib3enp5qxl5bslla' },
  { handle: 'challengesfr.bsky.social', displayName: 'Challenges', avatar: 'https://cdn.bsky.app/img/avatar/plain/did:plc:56yk6cagxatjj2k4eh5cobpo/bafkreiav6xfv33jsusr7jkuukpzwwdoolsrmbmpjjtjgyrulh7zxffeuxa' },
  { handle: 'charliehebdo.fr', displayName: 'Charlie Hebdo', avatar: 'https://cdn.bsky.app/img/avatar/plain/did:plc:vm2tsoixg7vsygrolxd4rrho/bafkreibtzaftgx54wwclo7ocd6skgozsbx7jq5m7vyetmkpubyijdhzgf4' },
  { handle: 'courrierinter.bsky.social', displayName: 'Courrier international', avatar: 'https://cdn.bsky.app/img/avatar/plain/did:plc:kfygevef2pjjsyu7dfd6xpxi/bafkreidtpw344uym7ilh7mghqhjcdcvvzrhjfi2ovdzp4ag44wrd63vwqq' },
  { handle: 'franceculture.fr', displayName: 'France Culture', avatar: 'https://cdn.bsky.app/img/avatar/plain/did:plc:3qyubes27sne6inqymxi4b4j/bafkreihuf64adii44g3ero2j7mg43kdkvx5bjls4zjhumlmhtqxjnu6yya' },
  { handle: 'france24.com', displayName: 'FRANCE 24', avatar: 'https://cdn.bsky.app/img/avatar/plain/did:plc:wkreszch2k4mumsrlkeaflgn/bafkreibi3cdxrcwhr5togn3dtgihmtfmwx5u4fbydp767yxcvmo5jgbq7q' },
  { handle: 'humanite.fr', displayName: "l'Humanité", avatar: 'https://cdn.bsky.app/img/avatar/plain/did:plc:vaats7pht5zoubxm6zaxq2zd/bafkreic27fcpk46xd5cgwxiqvgljb7lzdcb3rlqklyysq25omum4uy635a' },
  { handle: 'la-croix.com', displayName: 'La Croix', avatar: 'https://cdn.bsky.app/img/avatar/plain/did:plc:lv3e3gevfzmjvjcauffv4sjp/bafkreibuj6usfwybcc44gpjs3uxps3ksswdf6uwklm3tqoi3irnkmhq4ue' },
  { handle: 'lavoixdunord.fr', displayName: 'La Voix du Nord', avatar: 'https://cdn.bsky.app/img/avatar/plain/did:plc:5gboqophxgbh7htucfhyt5gb/bafkreihzviidt3sw6du4gs3c2jasyys244xo45uiqjsjywahc44tp3lfnm' },
  { handle: 'lefigaro.fr', displayName: 'Le Figaro', avatar: 'https://cdn.bsky.app/img/avatar/plain/did:plc:znu3bmhx5mx2icucilix5rpa/bafkreibrqh3inyl7cmhttheihnjznawqxo62v2k5x7ukwc3xgkvh72w4aq' },
  { handle: 'lecanardenchaine.fr', displayName: 'Le Canard enchaîné', avatar: 'https://cdn.bsky.app/img/avatar/plain/did:plc:uj54w5cel35z7qy3hk5zch4h/bafkreiawjxozxdvoarzasmvyiqku7ctsoqbwwpjcqahv5fyurttltmuvne' },
  { handle: 'lemonde.fr', displayName: 'Le Monde', avatar: 'https://cdn.bsky.app/img/avatar/plain/did:plc:qqxqxgdu5z3he2piqfbfaku4/bafkreiazagcb2d7ivnvgoqjufff3cbpjyj43jtxvyrqzulk5lrro7cemgm' },
  { handle: 'afrique.lemonde.fr', displayName: 'Le Monde Afrique', avatar: 'https://cdn.bsky.app/img/avatar/plain/did:plc:ggiopaobxfyknqlltcxddbmi/bafkreib65oh7hvdopn3kuqiul4ohuxhmfxvfdq6riuk42l3zi7h2mevc2a' },
  { handle: 'lepoint.fr', displayName: 'Le Point', avatar: 'https://cdn.bsky.app/img/avatar/plain/did:plc:aixwsdaeubfrxedelxe7rqwq/bafkreidcnybv5hzc3euw26cpxmodam6y3qsf5w6imxh6asax43a4mgrcoq' },
  { handle: 'lesechosfr.bsky.social', displayName: 'Les Echos', avatar: 'https://cdn.bsky.app/img/avatar/plain/did:plc:tuwg4bd73p5m7jrrmjhl2jix/bafkreidrfm5ta35ybp77vfda5jmrmlnug4yyt7le2ml37zp2qszxze55be' },
  { handle: 'liberation.fr', displayName: 'Libération', avatar: 'https://cdn.bsky.app/img/avatar/plain/did:plc:uo4didwt5qe4onrscbmqwvwm/bafkreie5puv24c5xxzh2y2ovf3jnjlhtn3w5iprb4lz2scmfxtc2t2eebu' },
  { handle: 'mediapart.fr', displayName: 'Mediapart', avatar: 'https://cdn.bsky.app/img/avatar/plain/did:plc:2egpzsea27fru2vkrjgdw2ob/bafkreiell2vpjxbrvddt63enj7jd2rwqzl47ivryhyetxbpqxpk3tuppjq' },
  { handle: 'monde-diplomatique.fr', displayName: 'Le Monde diplomatique', avatar: 'https://cdn.bsky.app/img/avatar/plain/did:plc:q4q2hko2prboin62shrck5ix/bafkreidg3zq3cnbnrytsaxoemy6gtapydmpaykzs3symq4z63cbvmk4ggi' },
  { handle: 'nouvelobs.com', displayName: 'Le Nouvel Obs', avatar: 'https://cdn.bsky.app/img/avatar/plain/did:plc:xhye77kvlv7vddwpapebsljj/bafkreicpzhgen5w56sqx33jsnswsjxdtd7yuivwslmsa7knbcftslegjym' },
  { handle: 'ouest-france.fr', displayName: 'Ouest-France', avatar: 'https://cdn.bsky.app/img/avatar/plain/did:plc:p7gdpofkiswapwrhfos7nqqd/bafkreifq5hzqrfqo7gmhw7x4dtr7qx6hvm3guydiznszhjwerpd3b3z5fa' },
  { handle: 'pixelsfr.bsky.social', displayName: 'Pixels | Le Monde', avatar: 'https://cdn.bsky.app/img/avatar/plain/did:plc:ug64elynwv5wsbg6cgr75hc3/bafkreievkg4gk2o65zpv3nb7ioxvifrh4kngwiidew4p7ddx7awtajborq' },
  { handle: 'rfi.fr', displayName: 'RFI', avatar: 'https://cdn.bsky.app/img/avatar/plain/did:plc:vvlpfarso2eojm2xpzc7qrd7/bafkreiblpeqcmcska4t5jux5uiipvsmwci4xvffthimktqbphseggv72v4' },
  { handle: 'telerama.bsky.social', displayName: 'Télérama', avatar: 'https://cdn.bsky.app/img/avatar/plain/did:plc:d4mzml4o35ineocvaluv5vss/bafkreibwv7t72coic6z2zrfprda7onuesrw7xcjq2fsbpwagkez57xbvyy' },
  { handle: '20minutes.bsky.social', displayName: '20 minutes', avatar: 'https://cdn.bsky.app/img/avatar/plain/did:plc:3mchts55ik67nxmtafua5gfd/bafkreid72cxugfbwnghcdg54wilczkwn5tgj2maao3cgdi5s32b4espkhq' },
  { handle: '28minutes-arte.bsky.social', displayName: '28 minutes - ARTE', avatar: 'https://cdn.bsky.app/img/avatar/plain/did:plc:2qysbywa47gzqu46n6h6dity/bafkreiby7e2z5vljz3e2z7jjqtrjnfndpthqpnw6nftcczjdtg2wp7d4dy' },
  { handle: 'artefr.bsky.social', displayName: 'ARTE', avatar: 'https://cdn.bsky.app/img/avatar/plain/did:plc:6lbh3sx5vzfhzjy2td2lafnq/bafkreifgl6edsha7mx3csltdetr2s5h2zfbdxtgikxl3nhmnvjc7vafziq' },
  { handle: 'contexte.com', displayName: 'Contexte', avatar: 'https://cdn.bsky.app/img/avatar/plain/did:plc:2v5gqgdyjqv4xtrg7iax6mwf/bafkreibo3s5u6uhmogno47roaf3j2pc7pmz4375sw7o5eor7mb4demvij4' },
  { handle: 'euronewsfr.bsky.social', displayName: 'Euronews en Français', avatar: 'https://cdn.bsky.app/img/avatar/plain/did:plc:oeu6wbebsrsy2x235t7ar3eu/bafkreifjt3gjiazcdwqvu64ctn6mcopchtd6wbuzd7f5cjtr3x6uepgzqe' },
  { handle: 'factuel.afp.com', displayName: 'AFP Factuel', avatar: 'https://cdn.bsky.app/img/avatar/plain/did:plc:4ks5wkubjfcbgxvphqkd3wxm/bafkreie6j7nhdhgqnycier7gvhwlmyztch4asibacu3k6rlhowbl4tvhme' },
  { handle: 'france3npdc.bsky.social', displayName: 'France 3 Nord Pas-de-Calais', avatar: 'https://cdn.bsky.app/img/avatar/plain/did:plc:szbhzsncadyh22lebcvz3qkl/bafkreih7yjwq4ibw3trtvpxwif4tfnocwj7nnfuibdgrwklbzyqhg7zmk4' },
  { handle: 'franceinfo.fr', displayName: 'franceinfo', avatar: 'https://cdn.bsky.app/img/avatar/plain/did:plc:vb7d3zz6khc7zqcg7743eqiq/bafkreiaclqgqttcym2utcynunohawuhc4amnh55zqgizit4cs52ptyjz5q' },
  { handle: 'franceinter.fr', displayName: 'France Inter', avatar: 'https://cdn.bsky.app/img/avatar/plain/did:plc:biwhb222rpid6vfji4j2uj3m/bafkreiblld2pjkq66npe5bj2nuxzphiou2gsdm2ctohimfop55aav5jnsu' },
  { handle: 'francetv.bsky.social', displayName: 'france.tv', avatar: 'https://cdn.bsky.app/img/avatar/plain/did:plc:z3xi5gootb5yzoxuba6ucsmt/bafkreic7kkqlcnpt2rxtgqpjovnjvmalovaahviasaq6jnmhrogoxgy4bi' },
  { handle: 'francetvculture.bsky.social', displayName: 'france tv culture', avatar: 'https://cdn.bsky.app/img/avatar/plain/did:plc:2pwf6z5x4pxwqppgp5t747sr/bafkreianuyaibpoc7lm5kcafuarnvi6s6oy3m4lhmjjbsb6rllrxvxx3xu' },
  { handle: 'huffingtonpost.fr', displayName: 'Le HuffPost', avatar: 'https://cdn.bsky.app/img/avatar/plain/did:plc:3dkkhd6dqiqswrxnitge3axp/bafkreicrm2xdwugzvhf2wttrenmrc6wb4647fjawwbjvc6ejhezy32lpt4' },
  { handle: 'larevuedesmedias.ina.fr', displayName: 'La Revue des médias', avatar: 'https://cdn.bsky.app/img/avatar/plain/did:plc:g6bs5amikddbqgq2idp5yo5d/bafkreif7dnriwkj6fyfyuuj6ynkpfjhtlk5b5vfupfwttk2tqdfuoqjnxy' },
  { handle: 'leparisien.fr', displayName: 'Le Parisien', avatar: 'https://cdn.bsky.app/img/avatar/plain/did:plc:anpfslmr5xhyw7oqzai3dprd/bafkreicj43s3lywac7idfkad2yqnk64hnh73gsnc5wf5zp4lcyf53vqq3m' },
  { handle: 'lexpress.fr', displayName: 'L’Express', avatar: 'https://cdn.bsky.app/img/avatar/plain/did:plc:fpambcnvhstbckgv23fh7rem/bafkreifvlmhy6tcv7lehnsm7brbcxgu534oohzyxafc45jcnundpwvwjei' },
  { handle: 'lvslmedia.bsky.social', displayName: 'Le Vent Se Lève', avatar: 'https://cdn.bsky.app/img/avatar/plain/did:plc:6b66t3n65h3v2rdz3yjoombc/bafkreiaifxno4y5765vxlzomzt2p6bkiak67nvnxnu7eaftmn6lvttvnha' },
  { handle: 'numerama.com', displayName: 'Numerama', avatar: 'https://cdn.bsky.app/img/avatar/plain/did:plc:kc53xgnevbecrg7xaimmfexh/bafkreieiinpdqezrxehcc5xjwx3c5tua3iy44rgp5gmm56ndivdowptznq' },
  { handle: 'radiofrance.fr', displayName: 'Radio France', avatar: 'https://cdn.bsky.app/img/avatar/plain/did:plc:xmxueyzsdchqowossr24xsjw/bafkreifl2dspy7nqiaejbkushkbd7ner364esinhxumbsnl7gupt7x23oe' },
  { handle: 'sudouest.fr', displayName: 'Sud Ouest', avatar: 'https://cdn.bsky.app/img/avatar/plain/did:plc:qtupmmogj72y37n7pl4u736w/bafkreicmucosl2v2lvuetye2p6fccp52roz74wc7xwoaznbpuhuqnjcis4' },
  { handle: 'usbeketrica.bsky.social', displayName: 'Usbek & Rica', avatar: 'https://cdn.bsky.app/img/avatar/plain/did:plc:n3fbgyh3jyfgheysmd6bftok/bafkreihemxjfeld2bgjctw4flmrlgtrn7ubps2srt7hwo5cggri4aajbh4' },
  { handle: 'viastella.bsky.social', displayName: 'France 3 Corse ViaStella', avatar: 'https://cdn.bsky.app/img/avatar/plain/did:plc:bhfnbmt4fq2fqkfiqh43er26/bafkreifl72bytlr3vz7suxzbhivzdhbwnflk5vuj7qjpb363mg4w26ybxy' },
];

// Members of the coop-medias.org Bluesky list.
const COOP_MEDIAS: SourceRow[] = [
  { handle: 'alternatives-economiques.fr', displayName: 'Alternatives Economiques', avatar: 'https://cdn.bsky.app/img/avatar/plain/did:plc:baubqpcuoesmvjiimxlers3v/bafkreiayjggk7lgpodsstxhnl5gzaztfdghbdohtmpbfajqhycbnko7fpq' },
  { handle: 'arretsurimages.net', displayName: 'Arrêt sur images', avatar: 'https://cdn.bsky.app/img/avatar/plain/did:plc:jmusvarqn5czqikhnqdmjyum/bafkreibbltn4p7fij7ssdpqyjjpgbl6c47hc45xduecvf5dtszl4ltsbqe' },
  { handle: 'arrierecourlyon.bsky.social', displayName: 'L\'Arrière-Cour', avatar: 'https://cdn.bsky.app/img/avatar/plain/did:plc:splrykrm5chnvvfx3x64lk6m/bafkreihd76pj4rfflgt6iwkcjj3b3v2i7pwwykisq2pmytzdcr44n35uoq' },
  { handle: 'auposte.media', displayName: 'Au Poste', avatar: 'https://cdn.bsky.app/img/avatar/plain/did:plc:g5jpm7mczglrlizpqkrtg2vm/bafkreidoynbxmtlpxixbovypq3lsjzx3e352qd4wzv33y4z2oozevo3fbu' },
  { handle: 'basta.media', displayName: 'Basta!', avatar: 'https://cdn.bsky.app/img/avatar/plain/did:plc:6tko42pks4rfcjh7rfqkzmhu/bafkreihctf36sbyhck55wfazhtkj5i2oybj4r6br23uxfldcj7fgmi4qqu' },
  { handle: 'blast-info.fr', displayName: 'Blast le souffle de l’info', avatar: 'https://cdn.bsky.app/img/avatar/plain/did:plc:omtqqkwusnfvxos7pxvl4fgo/bafkreicuchhqcsd4zzhtp3rhrkgtfl2nhqbmxlfmpfar2sqs7fe4v2xt2a' },
  { handle: 'bonpote.com', displayName: 'Bon Pote', avatar: 'https://cdn.bsky.app/img/avatar/plain/did:plc:yvxxxti5p2msnfh5kmzwa5f7/bafkreibwi5got7endw7d567rxyha2muzvgrtykxoveoqxa5tr5ihebthga' },
  { handle: 'cafepedagogique.bsky.social', displayName: 'Le Café pédagogique', avatar: 'https://cdn.bsky.app/img/avatar/plain/did:plc:jyignm6egdhsdfvwp2qnfaa7/bafkreih7rkbdlctlgxxbe3hbj546xfkgi7nesgcbmwr6jkyz6buf66bshm' },
  { handle: 'climaxfanzine.bsky.social', displayName: 'Climax', avatar: 'https://cdn.bsky.app/img/avatar/plain/did:plc:wudgxad76snhn2g5aiuluomb/bafkreigc36cehz6k6c6hkdh4q4wq7lp2jrpkipcfk66f67zjm2uz366swi' },
  { handle: 'contreattaque.bsky.social', displayName: 'Contre Attaque', avatar: 'https://cdn.bsky.app/img/avatar/plain/did:plc:gpss3375acfwih7x37b4kz2d/bafkreiepbfnwsmegidvtsn5shebsslycsq5vzonxwtiu4eqh3vp76vpiwq' },
  { handle: 'disclose.ngo', displayName: 'Disclose', avatar: 'https://cdn.bsky.app/img/avatar/plain/did:plc:qopr6txm3r27ym77th4ml46e/bafkreigdcq3bod4wh4m6l4nwfuhya6vgw47kde65ai3aj6tj6g3wxqfss4' },
  { handle: 'fracasmedia.bsky.social', displayName: 'Fracas', avatar: 'https://cdn.bsky.app/img/avatar/plain/did:plc:b4eex4djhkusk4s6cbqyeeol/bafkreiexnom7dehcbc7fq3qeztz6hm23vip37c7j5sq7xtoyqd7gx3wlh4' },
  { handle: 'histoires-crepues.bsky.social', displayName: 'Histoires Crépues', avatar: 'https://cdn.bsky.app/img/avatar/plain/did:plc:igelymoit75hraq5isrjcoor/bafkreiafvemxlipbr3ddngs7ghft3dcrfrmws6eepjmax35hggcfnz45t4' },
  { handle: 'infogm.bsky.social', displayName: 'Inf\'OGM', avatar: 'https://cdn.bsky.app/img/avatar/plain/did:plc:szch2x7jkivpf7g35lbemleo/bafkreicvts7d24g6m4s3z6dbvzticosdbipdvzrrfoxbtbes6bp3ieg6za' },
  { handle: 'ismee-lencre2mers.bsky.social', displayName: 'Ismée', avatar: 'https://cdn.bsky.app/img/avatar/plain/did:plc:n6ejpdhupv2u66gaxzpwkb2n/bafkreiabnwuje5pvmgwgrlixt6ykff7dza3ndxdb5w6svi6st4ma77fafy' },
  { handle: 'journalfakir.bsky.social', displayName: 'Fakir', avatar: 'https://cdn.bsky.app/img/avatar/plain/did:plc:ps6pjfubpbqfdzkmqgd2hfud/bafkreie4biy6vtpezq724m236sqqyxtqqiiy7wg4zqtcszzp76vhxdoyvu' },
  { handle: 'labreche.bsky.social', displayName: 'La Brèche', avatar: 'https://cdn.bsky.app/img/avatar/plain/did:plc:hczviiqcj24q7b3illzfjmmv/bafkreieuf7h6mmxxwwu5oo2auet2vd5jyh5kbqialepw7twvtoe2lg6pwm' },
  { handle: 'ladeferlante.bsky.social', displayName: 'La Déferlante', avatar: 'https://cdn.bsky.app/img/avatar/plain/did:plc:kszenqy72ke3sbpnv2c2ys5h/bafkreiakcx4h7x2jhz6sbsifjwld6xjgrltf2an7cyutzlpepzs43sr7gm' },
  { handle: 'lareleveetlapeste.bsky.social', displayName: 'La Relève et La Peste', avatar: 'https://cdn.bsky.app/img/avatar/plain/did:plc:7gkk2qg6257rziee5ylk6rc6/bafkreigua2ozs5nljgjvjhmjg2szkp7hcsln7rsnejlfp2o2xwzu3ecaaa' },
  { handle: 'lecrimedia.bsky.social', displayName: 'Le Cri', avatar: 'https://cdn.bsky.app/img/avatar/plain/did:plc:63vkisubtinver73glwgrwyl/bafkreibhxokgcuzztrai7nmsjlxuhfnxceyq7iqubbals2hsjbeljafkxi' },
  { handle: 'lemediatv.bsky.social', displayName: 'Le Média', avatar: 'https://cdn.bsky.app/img/avatar/plain/did:plc:hr4uzamyz54qo2lrf2isqcu3/bafkreidl2equcs5njbomh6xxzsp36mox32igkximutftxg4zvvykmt3t7y' },
  { handle: 'lesjours.fr', displayName: 'Les Jours', avatar: 'https://cdn.bsky.app/img/avatar/plain/did:plc:fleaqu2yloy5vpnb3wamdp6m/bafkreiej5h2k73ts367cfdfvvljq3tznrndw4nfrm723uv7efp3kiowur4' },
  { handle: 'lesnnews.bsky.social', displayName: 'Les Nouvelles News', avatar: 'https://cdn.bsky.app/img/avatar/plain/did:plc:gy4lyotb4cu3m7xq27ioja2i/bafkreif2konypsss7j4wct2p6tdnqumulx2ysrjhdlccp43gl7pcnc54iy' },
  { handle: 'lessurligneurs.bsky.social', displayName: 'Les Surligneurs', avatar: 'https://cdn.bsky.app/img/avatar/plain/did:plc:2lfzbk4eiy62o5blp4u6uywu/bafkreib5wzb2qinyimxevwas5njehj4gmxte2bikuwskvl7oftejfq5xpm' },
  { handle: 'lezephyrmag.bsky.social', displayName: 'Le Zéphyr', avatar: 'https://cdn.bsky.app/img/avatar/plain/did:plc:mza47omwxgxlu2i2zqqikcp5/bafkreicl6nex3hpz3mqe3tilroe467lcutxbhy2nhxcjfxctznlffvw6xi' },
  { handle: 'madeinperpignan.com', displayName: 'Made in Perpignan', avatar: 'https://cdn.bsky.app/img/avatar/plain/did:plc:jff4g6nvslef66i4vjhbxiog/bafkreidc4skh23pivtei2nqlf7l7y544wdzhc4qorrxdy5y3vfaozjoneu' },
  { handle: 'marsactu.fr', displayName: 'Marsactu', avatar: 'https://cdn.bsky.app/img/avatar/plain/did:plc:oheo2dfm2v5mzptwn7juiku4/bafkreidwrfcfd3mb4qgnl2q2nvaxntulbagrqwc62uo4ahrc7fpaajzxzu' },
  { handle: 'mediacites.fr', displayName: 'Mediacités', avatar: 'https://cdn.bsky.app/img/avatar/plain/did:plc:6eptybcqvf2hzvqgg4fwnhrs/bafkreie32zkeijqhg5ziwgrjw5237oujd355lcculy245atkksad4cgnk4' },
  { handle: 'mob-media.info', displayName: 'MOB', avatar: 'https://cdn.bsky.app/img/avatar/plain/did:plc:r6j73vtjbqv2ywtaxmtegpdi/bafkreicitwcacdp2cxlnrkiutewxouolgemrfzxjv4qngwfyxjazgz6rx4' },
  { handle: 'mr-mondialisation.bsky.social', displayName: 'Mr Mondialisation', avatar: 'https://cdn.bsky.app/img/avatar/plain/did:plc:vedmvdug2odqrvv63huxl4nd/bafkreibzvkjxy2jbhtghtxjqygqbzhpzbhndzlwtkwird5xc3slss6zgty' },
  { handle: 'obsmultinationales.bsky.social', displayName: 'Observatoire des multinationales', avatar: 'https://cdn.bsky.app/img/avatar/plain/did:plc:dr2szexl7halmn5g2cnmd6tv/bafkreigbcnci5jx2lkdr27bqtbkclbzmlzkb3wl5dt3qynzbvg6h7i3ouu' },
  { handle: 'onestpret.bsky.social', displayName: 'On Est Prêt', avatar: 'https://cdn.bsky.app/img/avatar/plain/did:plc:kvql5hr5mcfchjxgse7cz6h6/bafkreia673ipbizheeszhk7k5cbwscanhctc46ka7dt3yp2hwellymptpe' },
  { handle: 'politis.fr', displayName: 'Politis', avatar: 'https://cdn.bsky.app/img/avatar/plain/did:plc:oj6rklu3kys7xf37e2kmlnl5/bafkreid7tv37vhedi3tzxmpioszynogjmivsc6l2ofjhqxkr44xif4wvty' },
  { handle: 'radioparleur.bsky.social', displayName: 'Radio Parleur', avatar: 'https://cdn.bsky.app/img/avatar/plain/did:plc:gkdbnx3tkhertno2fppdy23h/bafkreie5w372uon7347kunvloocinmh6bdf7q5vpr7ahxuwdcpk24e7dkq' },
  { handle: 'reflets.info', displayName: 'Reflets.info', avatar: 'https://cdn.bsky.app/img/avatar/plain/did:plc:5szwfaibfba3urbuewvy6s7z/bafkreic3sehd64c55lcd3agbc7rl43my4padawf3y3xxaznmfzazanwvla' },
  { handle: 'rembobine.info', displayName: 'Rembobine', avatar: 'https://cdn.bsky.app/img/avatar/plain/did:plc:xjv3g6e33akoiblhur5qdogz/bafkreig3yxpvnf5deqcakonv3f3k5mdqxnhla27qxmso65wbqywwhdc43m' },
  { handle: 'reporterre.net', displayName: 'Reporterre', avatar: 'https://cdn.bsky.app/img/avatar/plain/did:plc:2htr6vzopp6mejep7qcpszru/bafkreibpnuque2tamx4vdn4epx6uzcfnbxm4wmmqjuonpaaamgsco63w4e' },
  { handle: 'rue89bordeaux.bsky.social', displayName: 'Rue89 Bordeaux', avatar: 'https://cdn.bsky.app/img/avatar/plain/did:plc:zh22aza6z77iuccvjv5hi3a3/bafkreidudqy6b3dwfplnqtezz43pj3wuvfzo2xv2kg7mfzvkkh6ogzoi7y' },
  { handle: 'rue89lyon.fr', displayName: 'Rue89 Lyon', avatar: 'https://cdn.bsky.app/img/avatar/plain/did:plc:3czjmqbo4rwlju2xts6n6l2q/bafkreibov7wfar4otu3l6ddcf5wl2fvnox45ifpybqelov5ua6p67557ji' },
  { handle: 'rue89strasbourg.com', displayName: 'Rue89 Strasbourg', avatar: 'https://cdn.bsky.app/img/avatar/plain/did:plc:rtsmx6pozn2d5qnsxrrk3x3n/bafkreigxglbuuckcecmjer35fme5y3od2zru5x7x4u67v4tczmrqbenyiu' },
  { handle: 'socialter.bsky.social', displayName: 'Socialter', avatar: 'https://cdn.bsky.app/img/avatar/plain/did:plc:mndkrgnypgolpap7uu7vhnbp/bafkreifdcqpj3zwpyedbfwwcx6gtc6u3g3r6jq2sgl45jz4znbkt3h5ofi' },
  { handle: 'splann.org', displayName: 'Splann !', avatar: 'https://cdn.bsky.app/img/avatar/plain/did:plc:cwes724oksnd4kx53aacmw7p/bafkreiakbdnofdgandjiyh2etgaxi4vsoqgdqhyzuzfsras3yghoebepse' },
  { handle: 'streetpress.bsky.social', displayName: 'StreetPress', avatar: 'https://cdn.bsky.app/img/avatar/plain/did:plc:oc4vdaapdvl4rpxg7szifvqv/bafkreidtoi2whwpv4gnvc76oaftvz6kjvtquao6t6hckprxvksbodrf2i4' },
  { handle: 'unboutdesmedias.bsky.social', displayName: 'Un Bout Des Médias', avatar: 'https://cdn.bsky.app/img/avatar/plain/did:plc:azsjkflvaopiqakrhofnf7ui/bafkreicyge7m7sjsxm6n7cwbxl6v2zqwlez43qgnabepdyjfndslhrdafi' },
  { handle: 'urbania-fr.bsky.social', displayName: 'Urbania', avatar: 'https://cdn.bsky.app/img/avatar/plain/did:plc:apnv7kn33oi3il6apnzhvpwb/bafkreid7i3luolue47sttpzf3bqgajbma35hadeo3lmcdy6uwmr25sifqm' },
  { handle: 'vert.eco', displayName: 'Vert', avatar: 'https://cdn.bsky.app/img/avatar/plain/did:plc:ittis6mfcchi54qe7m7d5mun/bafkreicdpbi63oub4gy2dplc3w4rck6tinqrwcwvnlktikkt5y5d3b7qti' },
  { handle: 'vivantlemedia.bsky.social', displayName: 'Vivant le média', avatar: 'https://cdn.bsky.app/img/avatar/plain/did:plc:4ows566nrwxvuvmpgide5wo4/bafkreievipspaiz2wptlb3bld5vb2jk3tlve7ex6cgc2ijwbw4tpazjkua' },
  { handle: 'voxeurop.bsky.social', displayName: 'Voxeurop', avatar: 'https://cdn.bsky.app/img/avatar/plain/did:plc:5ofbcsv232rb74bae7uscdy4/bafkreiaqdhvezldvmusonquytfqm3yjhpq7iwzvuesnsi5rqkjsrpbm3mq' },
];

const byName = (rows: SourceRow[]): SourceRow[] =>
  [...rows].sort((a, b) => a.displayName.localeCompare(b.displayName, 'fr', { sensitivity: 'base' }));

export function sourcesOf(list: string | undefined): Sources {
  if (list === 'fr-coop-medias') {
    return {
      list: 'fr-coop-medias',
      origin: 'de médias français et de',
      originLink: { href: 'https://www.coop-medias.org/', label: 'https://www.coop-medias.org/' },
      roster: byName([...FRENCH_MEDIA, ...COOP_MEDIAS]),
    };
  }

  if (list === 'coop-medias') {
    return {
      list: 'coop-medias',
      origin: 'de',
      originLink: { href: 'https://www.coop-medias.org/', label: 'https://www.coop-medias.org/' },
      roster: byName(COOP_MEDIAS),
    };
  }

  return { list: 'fr', origin: 'de médias français', roster: byName(FRENCH_MEDIA) };
}

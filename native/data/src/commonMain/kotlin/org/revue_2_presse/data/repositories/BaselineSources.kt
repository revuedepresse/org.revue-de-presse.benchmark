package org.revue_2_presse.data.repositories

import kotlinx.datetime.LocalDate
import org.revue_2_presse.domain.entities.Source

// Canonical roster of French press Bluesky accounts the project tracks. The API
// derives the source list from the 90-day highlights window, so any account
// that hasn't been highlighted recently disappears from /sources. This baseline
// is merged in by SourcesRepositoryImpl so the full roster is always visible,
// even if some media haven't published recently.
//
// avatarUrl + displayName are pre-resolved (Bluesky public XRPC
// app.bsky.actor.getProfile) so baseline-filler rows never render a grey
// placeholder. Bluesky CDN URLs include the post-content hash and stay stable.
internal object BaselineSources {

    private data class Entry(val displayName: String, val avatarUrl: String)

    private val roster: Map<String, Entry> = mapOf(
        "afp.com" to Entry("Agence France-Presse",
            "https://cdn.bsky.app/img/avatar/plain/did:plc:ffccycfh6c6pmxwkhvq5clkv/bafkreiadcsh7hzzurk5joh7bhxxlyqlvr26mg25f6dnozuwhsz72jz2cme"),
        "bfmtv.com" to Entry("BFMTV",
            "https://cdn.bsky.app/img/avatar/plain/did:plc:wb4ovhhcrif6cp66oe2pqx7i/bafkreic3fjfw4c2hbqailogxb2nusnspddwczt5bhyib3enp5qxl5bslla"),
        "blast-info.fr" to Entry("Blast le souffle de l’info",
            "https://cdn.bsky.app/img/avatar/plain/did:plc:omtqqkwusnfvxos7pxvl4fgo/bafkreicuchhqcsd4zzhtp3rhrkgtfl2nhqbmxlfmpfar2sqs7fe4v2xt2a"),
        "challengesfr.bsky.social" to Entry("Challenges",
            "https://cdn.bsky.app/img/avatar/plain/did:plc:56yk6cagxatjj2k4eh5cobpo/bafkreiav6xfv33jsusr7jkuukpzwwdoolsrmbmpjjtjgyrulh7zxffeuxa"),
        "charliehebdo.fr" to Entry("Charlie Hebdo",
            "https://cdn.bsky.app/img/avatar/plain/did:plc:vm2tsoixg7vsygrolxd4rrho/bafkreibtzaftgx54wwclo7ocd6skgozsbx7jq5m7vyetmkpubyijdhzgf4"),
        "courrierinter.bsky.social" to Entry("Courrier international",
            "https://cdn.bsky.app/img/avatar/plain/did:plc:kfygevef2pjjsyu7dfd6xpxi/bafkreidtpw344uym7ilh7mghqhjcdcvvzrhjfi2ovdzp4ag44wrd63vwqq"),
        "franceculture.fr" to Entry("France Culture",
            "https://cdn.bsky.app/img/avatar/plain/did:plc:3qyubes27sne6inqymxi4b4j/bafkreihuf64adii44g3ero2j7mg43kdkvx5bjls4zjhumlmhtqxjnu6yya"),
        "france24.com" to Entry("FRANCE 24",
            "https://cdn.bsky.app/img/avatar/plain/did:plc:wkreszch2k4mumsrlkeaflgn/bafkreibi3cdxrcwhr5togn3dtgihmtfmwx5u4fbydp767yxcvmo5jgbq7q"),
        "humanite.fr" to Entry("l'Humanité",
            "https://cdn.bsky.app/img/avatar/plain/did:plc:vaats7pht5zoubxm6zaxq2zd/bafkreic27fcpk46xd5cgwxiqvgljb7lzdcb3rlqklyysq25omum4uy635a"),
        "la-croix.com" to Entry("La Croix",
            "https://cdn.bsky.app/img/avatar/plain/did:plc:lv3e3gevfzmjvjcauffv4sjp/bafkreibuj6usfwybcc44gpjs3uxps3ksswdf6uwklm3tqoi3irnkmhq4ue"),
        "lavoixdunord.fr" to Entry("La Voix du Nord",
            "https://cdn.bsky.app/img/avatar/plain/did:plc:5gboqophxgbh7htucfhyt5gb/bafkreihzviidt3sw6du4gs3c2jasyys244xo45uiqjsjywahc44tp3lfnm"),
        "lefigaro.fr" to Entry("Le Figaro",
            "https://cdn.bsky.app/img/avatar/plain/did:plc:znu3bmhx5mx2icucilix5rpa/bafkreibrqh3inyl7cmhttheihnjznawqxo62v2k5x7ukwc3xgkvh72w4aq"),
        "lecanardenchaine.fr" to Entry("Le Canard enchaîné",
            "https://cdn.bsky.app/img/avatar/plain/did:plc:uj54w5cel35z7qy3hk5zch4h/bafkreiawjxozxdvoarzasmvyiqku7ctsoqbwwpjcqahv5fyurttltmuvne"),
        "lemonde.fr" to Entry("Le Monde",
            "https://cdn.bsky.app/img/avatar/plain/did:plc:qqxqxgdu5z3he2piqfbfaku4/bafkreiazagcb2d7ivnvgoqjufff3cbpjyj43jtxvyrqzulk5lrro7cemgm"),
        "afrique.lemonde.fr" to Entry("Le Monde Afrique",
            "https://cdn.bsky.app/img/avatar/plain/did:plc:ggiopaobxfyknqlltcxddbmi/bafkreib65oh7hvdopn3kuqiul4ohuxhmfxvfdq6riuk42l3zi7h2mevc2a"),
        "lepoint.fr" to Entry("Le Point",
            "https://cdn.bsky.app/img/avatar/plain/did:plc:aixwsdaeubfrxedelxe7rqwq/bafkreidcnybv5hzc3euw26cpxmodam6y3qsf5w6imxh6asax43a4mgrcoq"),
        "lesechosfr.bsky.social" to Entry("Les Echos",
            "https://cdn.bsky.app/img/avatar/plain/did:plc:tuwg4bd73p5m7jrrmjhl2jix/bafkreidrfm5ta35ybp77vfda5jmrmlnug4yyt7le2ml37zp2qszxze55be"),
        "lesjours.fr" to Entry("Les Jours",
            "https://cdn.bsky.app/img/avatar/plain/did:plc:fleaqu2yloy5vpnb3wamdp6m/bafkreiej5h2k73ts367cfdfvvljq3tznrndw4nfrm723uv7efp3kiowur4"),
        "liberation.fr" to Entry("Libération",
            "https://cdn.bsky.app/img/avatar/plain/did:plc:uo4didwt5qe4onrscbmqwvwm/bafkreie5puv24c5xxzh2y2ovf3jnjlhtn3w5iprb4lz2scmfxtc2t2eebu"),
        "mediapart.fr" to Entry("Mediapart",
            "https://cdn.bsky.app/img/avatar/plain/did:plc:2egpzsea27fru2vkrjgdw2ob/bafkreiell2vpjxbrvddt63enj7jd2rwqzl47ivryhyetxbpqxpk3tuppjq"),
        "monde-diplomatique.fr" to Entry("Le Monde diplomatique",
            "https://cdn.bsky.app/img/avatar/plain/did:plc:q4q2hko2prboin62shrck5ix/bafkreidg3zq3cnbnrytsaxoemy6gtapydmpaykzs3symq4z63cbvmk4ggi"),
        "nouvelobs.com" to Entry("Le Nouvel Obs",
            "https://cdn.bsky.app/img/avatar/plain/did:plc:xhye77kvlv7vddwpapebsljj/bafkreicpzhgen5w56sqx33jsnswsjxdtd7yuivwslmsa7knbcftslegjym"),
        "ouest-france.fr" to Entry("Ouest-France",
            "https://cdn.bsky.app/img/avatar/plain/did:plc:p7gdpofkiswapwrhfos7nqqd/bafkreifq5hzqrfqo7gmhw7x4dtr7qx6hvm3guydiznszhjwerpd3b3z5fa"),
        "pixelsfr.bsky.social" to Entry("Pixels | Le Monde",
            "https://cdn.bsky.app/img/avatar/plain/did:plc:ug64elynwv5wsbg6cgr75hc3/bafkreievkg4gk2o65zpv3nb7ioxvifrh4kngwiidew4p7ddx7awtajborq"),
        "rfi.fr" to Entry("RFI",
            "https://cdn.bsky.app/img/avatar/plain/did:plc:vvlpfarso2eojm2xpzc7qrd7/bafkreiblpeqcmcska4t5jux5uiipvsmwci4xvffthimktqbphseggv72v4"),
        "telerama.bsky.social" to Entry("Télérama",
            "https://cdn.bsky.app/img/avatar/plain/did:plc:d4mzml4o35ineocvaluv5vss/bafkreibwv7t72coic6z2zrfprda7onuesrw7xcjq2fsbpwagkez57xbvyy"),
    )

    // Placeholder firstSeenAt for baseline entries whose API record is absent.
    // The project's archive floor (2025-03-04) is the reasonable conservative
    // lower bound — these accounts existed at or before that point.
    private val placeholderFirstSeenAt: LocalDate = LocalDate(2025, 3, 4)

    fun asSources(): List<Source> = roster.map { (handle, entry) ->
        Source(
            screenName = handle,
            displayName = entry.displayName,
            avatarUrl = entry.avatarUrl,
            firstSeenAt = placeholderFirstSeenAt,
            highlightsCount = 0,
        )
    }
}

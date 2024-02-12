/** @type {(trpcApiDomain: string) => string} */
export const getContentSecurityPolicy = (trpcApiDomain) =>
	`base-uri 'self';
connect-src 'self' ${trpcApiDomain} *.google-analytics.com *.analytics.google.com analytics.google.com *.googletagmanager.com *.g.doubleclick.net *.google.com *.google.ad *.google.ae *.google.com.af *.google.com.ag *.google.al *.google.am *.google.co.ao *.google.com.ar *.google.as *.google.at *.google.com.au *.google.az *.google.ba *.google.com.bd *.google.be *.google.bf *.google.bg *.google.com.bh *.google.bi *.google.bj *.google.com.bn *.google.com.bo *.google.com.br *.google.bs *.google.bt *.google.co.bw *.google.by *.google.com.bz *.google.ca *.google.cd *.google.cf *.google.cg *.google.ch *.google.ci *.google.co.ck *.google.cl *.google.cm *.google.cn *.google.com.co *.google.co.cr *.google.com.cu *.google.cv *.google.com.cy *.google.cz *.google.de *.google.dj *.google.dk *.google.dm *.google.com.do *.google.dz *.google.com.ec *.google.ee *.google.com.eg *.google.es *.google.com.et *.google.fi *.google.com.fj *.google.fm *.google.fr *.google.ga *.google.ge *.google.gg *.google.com.gh *.google.com.gi *.google.gl *.google.gm *.google.gr *.google.com.gt *.google.gy *.google.com.hk *.google.hn *.google.hr *.google.ht *.google.hu *.google.co.id *.google.ie *.google.co.il *.google.im *.google.co.in *.google.iq *.google.is *.google.it *.google.je *.google.com.jm *.google.jo *.google.co.jp *.google.co.ke *.google.com.kh *.google.ki *.google.kg *.google.co.kr *.google.com.kw *.google.kz *.google.la *.google.com.lb *.google.li *.google.lk *.google.co.ls *.google.lt *.google.lu *.google.lv *.google.com.ly *.google.co.ma *.google.md *.google.me *.google.mg *.google.mk *.google.ml *.google.com.mm *.google.mn *.google.com.mt *.google.mu *.google.mv *.google.mw *.google.com.mx *.google.com.my *.google.co.mz *.google.com.na *.google.com.ng *.google.com.ni *.google.ne *.google.nl *.google.no *.google.com.np *.google.nr *.google.nu *.google.co.nz *.google.com.om *.google.com.pa *.google.com.pe *.google.com.pg *.google.com.ph *.google.com.pk *.google.pl *.google.pn *.google.com.pr *.google.ps *.google.pt *.google.com.py *.google.com.qa *.google.ro *.google.ru *.google.rw *.google.com.sa *.google.com.sb *.google.sc *.google.se *.google.com.sg *.google.sh *.google.si *.google.sk *.google.com.sl *.google.sn *.google.so *.google.sm *.google.sr *.google.st *.google.com.sv *.google.td *.google.tg *.google.co.th *.google.com.tj *.google.tl *.google.tm *.google.tn *.google.to *.google.com.tr *.google.tt *.google.com.tw *.google.co.tz *.google.com.ua *.google.co.ug *.google.co.uk *.google.com.uy *.google.co.uz *.google.com.vc *.google.co.ve *.google.co.vi *.google.com.vn *.google.vu *.google.ws *.google.rs *.google.co.za *.google.co.zm *.google.co.zw *.google.cat;
default-src 'self';
font-src 'self' data: fonts.gstatic.com fonts.googleapis.com;
frame-src 'self' www.google.com td.doubleclick.net;
img-src 'self' data: blob: ssl.gstatic.com www.gstatic.com *.google-analytics.com *.analytics.google.com *.googletagmanager.com *.g.doubleclick.net *.google.com *.google.ad *.google.ae *.google.com.af *.google.com.ag *.google.al *.google.am *.google.co.ao *.google.com.ar *.google.as *.google.at *.google.com.au *.google.az *.google.ba *.google.com.bd *.google.be *.google.bf *.google.bg *.google.com.bh *.google.bi *.google.bj *.google.com.bn *.google.com.bo *.google.com.br *.google.bs *.google.bt *.google.co.bw *.google.by *.google.com.bz *.google.ca *.google.cd *.google.cf *.google.cg *.google.ch *.google.ci *.google.co.ck *.google.cl *.google.cm *.google.cn *.google.com.co *.google.co.cr *.google.com.cu *.google.cv *.google.com.cy *.google.cz *.google.de *.google.dj *.google.dk *.google.dm *.google.com.do *.google.dz *.google.com.ec *.google.ee *.google.com.eg *.google.es *.google.com.et *.google.fi *.google.com.fj *.google.fm *.google.fr *.google.ga *.google.ge *.google.gg *.google.com.gh *.google.com.gi *.google.gl *.google.gm *.google.gr *.google.com.gt *.google.gy *.google.com.hk *.google.hn *.google.hr *.google.ht *.google.hu *.google.co.id *.google.ie *.google.co.il *.google.im *.google.co.in *.google.iq *.google.is *.google.it *.google.je *.google.com.jm *.google.jo *.google.co.jp *.google.co.ke *.google.com.kh *.google.ki *.google.kg *.google.co.kr *.google.com.kw *.google.kz *.google.la *.google.com.lb *.google.li *.google.lk *.google.co.ls *.google.lt *.google.lu *.google.lv *.google.com.ly *.google.co.ma *.google.md *.google.me *.google.mg *.google.mk *.google.ml *.google.com.mm *.google.mn *.google.com.mt *.google.mu *.google.mv *.google.mw *.google.com.mx *.google.com.my *.google.co.mz *.google.com.na *.google.com.ng *.google.com.ni *.google.ne *.google.nl *.google.no *.google.com.np *.google.nr *.google.nu *.google.co.nz *.google.com.om *.google.com.pa *.google.com.pe *.google.com.pg *.google.com.ph *.google.com.pk *.google.pl *.google.pn *.google.com.pr *.google.ps *.google.pt *.google.com.py *.google.com.qa *.google.ro *.google.ru *.google.rw *.google.com.sa *.google.com.sb *.google.sc *.google.se *.google.com.sg *.google.sh *.google.si *.google.sk *.google.com.sl *.google.sn *.google.so *.google.sm *.google.sr *.google.st *.google.com.sv *.google.td *.google.tg *.google.co.th *.google.com.tj *.google.tl *.google.tm *.google.tn *.google.to *.google.com.tr *.google.tt *.google.com.tw *.google.co.tz *.google.com.ua *.google.co.ug *.google.co.uk *.google.com.uy *.google.co.uz *.google.com.vc *.google.co.ve *.google.co.vi *.google.com.vn *.google.vu *.google.ws *.google.rs *.google.co.za *.google.co.zm *.google.co.zw *.google.cat;
object-src 'none';
script-src 'report-sample' 'self' 'unsafe-inline' 'unsafe-eval' www.google.com *.googletagmanager.com www.gstatic.com tagmanager.google.com;
style-src 'report-sample' 'self' 'unsafe-inline' googletagmanager.com tagmanager.google.com fonts.googleapis.com;
manifest-src 'self';
media-src 'self';
worker-src blob:;
report-to default;`.replace(/\n/g, '')

/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true
}

// CSP via Next should be on localhost only
// In the deployed app it's handled by CloudFront
if (process.env.IS_LOCAL === 'true') {
	nextConfig.headers = async () => [
		{
			source: '/(.*)',
			headers: [
				{
					key: 'Content-Security-Policy',
					value: getContentSecurityPolicy(
						process.env.NEXT_PUBLIC_TRPC_API_URL.replace(
							'https://',
							''
						).replace(/.com\/.*/, '.com')
					)
				}
			]
		}
	]
}

export default nextConfig

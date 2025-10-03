import { Button } from "@popcorntime/ui/components/button";
import { Spinner } from "@popcorntime/ui/components/spinner";
import { ArrowLeft, ArrowRight, Popcorn } from "lucide-react";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router";
import { useTauri } from "@/hooks/useTauri";
import { useGlobalStore } from "@/stores/global";

export function OnboardingTOS() {
	const direction = useGlobalStore(state => state.i18n.direction);
	const { api } = useTauri();
	const [isLoading, setIsLoading] = useState(false);
	const navigate = useNavigate();
	const { t } = useTranslation();

	const handleContinue = useCallback(async () => {
		const { settingsSucceeded, settingsFailed } = useGlobalStore.getState();
		setIsLoading(true);
		api
			.updateSettings({ tosAccepted: true })
			.then(settingsSucceeded)
			.catch(settingsFailed)
			.finally(() => {
				setIsLoading(false);
				navigate("/browse");
			});
	}, [api, setIsLoading]);

	return (
		<div className="h-screen max-h-screen flex flex-col">
			<header className="sticky top-0 z-10 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
				<div className="mx-auto w-full max-w-6xl px-6 py-6 mt-10">
					<div className="text-center space-y-3">
						<div className="hidden lg:flex w-14 h-14 mx-auto bg-primary/20 rounded-full  items-center justify-center">
							<Popcorn className="w-7 h-7 text-primary" />
						</div>
						<h2 className="text-3xl font-bold text-foreground">{t("tos.title")}</h2>
						<p className="text-muted-foreground text-pretty max-w-2xl mx-auto">
							{t("tos.description")}
						</p>
					</div>
				</div>
			</header>

			<main className="flex-1 overflow-y-auto">
				<div className="mx-auto w-full max-w-6xl px-6 py-6">
					<div className="mx-auto max-w-[40rem]">
						<div className="space-y-5 text-muted-foreground">
							<p className="italic leading-7 [&:not(:first-child)]:mt-6">
								Last updated October 03, 2025
							</p>
							<p className="leading-7 [&:not(:first-child)]:mt-6">
								We operate the website{" "}
								<Link to="https://popcorntime.app" className="underline" target="_blank">
									popcorntime.app
								</Link>{" "}
								(the &quot;Site&quot;), the application Popcorn Time (the &quot;App&quot;) available
								on desktop, mobile, smart TV, and other platforms, as well as any related products
								or services that reference these legal terms (the &quot;Legal Terms&quot;)
								(collectively, the &quot;Services&quot;).
							</p>
							<p className="leading-7 [&:not(:first-child)]:mt-6">
								These legal terms constitute a legally binding agreement made between you, whether
								personally or on behalf of an entity (&quot;you&quot;), and WICKED TECHNOLOGY
								LIMITED, concerning your access to and use of the Services. You agree that by
								accessing the Services, you have read, understood, and agreed to be bound by all of
								these Legal Terms. IF YOU DO NOT AGREE WITH ALL OF THESE LEGAL TERMS, THEN YOU ARE
								EXPRESSLY PROHIBITED FROM USING THE SERVICES AND YOU MUST DISCONTINUE USE
								IMMEDIATELY.
							</p>
							<p className="leading-7 [&:not(:first-child)]:mt-6">
								Supplemental terms and conditions or documents that may be posted on the Services
								from time to time are hereby expressly incorporated herein by reference. We reserve
								the right, in our sole discretion, to make changes or modifications to these Legal
								Terms from time to time. We will alert you about any changes by updating the
								&quot;Last updated&quot; date of these Legal Terms, and you waive any right to
								receive specific notice of each such change. It is your responsibility to
								periodically review these Legal Terms to stay informed of updates. You will be
								subject to, and will be deemed to have been made aware of and to have accepted, the
								changes in any revised Legal Terms by your continued use of the Services after the
								date such revised Legal Terms are posted.
							</p>
							<p className="leading-7 [&:not(:first-child)]:mt-6">
								The Services are intended for users who are at least 13 years of age. All users who
								are minors in the jurisdiction in which they reside (generally under the age of 18)
								must have the permission of, and be directly supervised by, their parent or guardian
								to use the Services. If you are a minor, you must have your parent or guardian read
								and agree to these Legal Terms prior to you using the Services.
							</p>

							<h3 className="font-bold text-xl">1. OUR SERVICES</h3>
							<p className="leading-7 [&:not(:first-child)]:mt-6">
								The information provided when using the Services is not intended for distribution to
								or use by any person or entity in any jurisdiction or country where such
								distribution or use would be contrary to law or regulation or which would subject us
								to any registration requirement within such jurisdiction or country. Accordingly,
								those persons who choose to access the Services from other locations do so on their
								own initiative and are solely responsible for compliance with local laws, if and to
								the extent local laws are applicable.
							</p>

							<h3 className="font-bold text-xl">2. INTELLECTUAL PROPERTY RIGHTS</h3>

							<p className="leading-7 [&:not(:first-child)]:mt-6">
								We are the owner or the licensee of all intellectual property rights in our
								Services, including all source code, databases, functionality, software, website
								designs, audio, video, text, photographs, and graphics in the Services
								(collectively, the &quot;Content&quot;), as well as the trademarks, service marks,
								and logos contained therein (the &quot;Marks&quot;).
							</p>

							<p className="leading-7 [&:not(:first-child)]:mt-6">
								Our Content and Marks are protected by copyright and trademark laws (and various
								other intellectual property rights and unfair competition laws) and treaties in the
								United States and around the world.
							</p>

							<p className="leading-7 [&:not(:first-child)]:mt-6">
								The Content and Marks are provided in or through the Services &quot;AS IS&quot; for
								your personal, non-commercial use or internal business purpose only.
							</p>

							<p className="leading-7 [&:not(:first-child)]:mt-6">
								Subject to your compliance with these Legal Terms, including the &quot;PROHIBITED
								ACTIVITIES&quot; section below, we grant you a non-exclusive, non-transferable,
								revocable license to: access the Services; and download or print a copy of any
								portion of the Content to which you have properly gained access. solely for your
								personal, non-commercial use or internal business purpose.
							</p>

							<p className="leading-7 [&:not(:first-child)]:mt-6">
								Except as set out in this section or elsewhere in our Legal Terms, no part of the
								Services and no Content or Marks may be copied, reproduced, aggregated, republished,
								uploaded, posted, publicly displayed, encoded, translated, transmitted, distributed,
								sold, licensed, or otherwise exploited for any commercial purpose whatsoever,
								without our express prior written permission.
							</p>

							<p className="leading-7 [&:not(:first-child)]:mt-6">
								If you wish to make any use of the Services, Content, or Marks other than as set out
								in this section or elsewhere in our Legal Terms, please address your request to:
								<a href="mailto:hey@popcorntime.app" className="underline">
									hey@popcorntime.app
								</a>
								. If we ever grant you the permission to post, reproduce, or publicly display any
								part of our Services or Content, you must identify us as the owners or licensors of
								the Services, Content, or Marks and ensure that any copyright or proprietary notice
								appears or is visible on posting, reproducing, or displaying our Content.
							</p>
							<p className="leading-7 [&:not(:first-child)]:mt-6">
								We reserve all rights not expressly granted to you in and to the Services, Content,
								and Marks.
							</p>

							<p className="leading-7 [&:not(:first-child)]:mt-6">
								Any breach of these Intellectual Property Rights will constitute a material breach
								of our Legal Terms and your right to use our Services will terminate immediately.
							</p>

							<p className="leading-7 [&:not(:first-child)]:mt-6">
								We respect the intellectual property rights of others. If you believe that any
								material available on or through the Services infringes upon any copyright you own
								or control, please immediately refer to the &quot;COPYRIGHT INFRINGEMENTS&quot;
								section below.
							</p>

							<h3 className="font-bold text-xl">3. USER REPRESENTATIONS</h3>

							<p className="leading-7 [&:not(:first-child)]:mt-6">
								By using the Services, you represent and warrant that: (1) all registration
								information you submit will be true, accurate, current, and complete; (2) you will
								maintain the accuracy of such information and promptly update such registration
								information as necessary; (3) you have the legal capacity and you agree to comply
								with these Legal Terms; (4) you are not under the age of 13; (5) you are not a minor
								in the jurisdiction in which you reside, or if a minor, you have received parental
								permission to use the Services; (6) you will not access the Services through
								automated or non-human means, whether through a bot, script or otherwise; (7) you
								will not use the Services for any illegal or unauthorized purpose; and (8) your use
								of the Services will not violate any applicable law or regulation.
							</p>

							<p className="leading-7 [&:not(:first-child)]:mt-6">
								If you provide any information that is untrue, inaccurate, not current, or
								incomplete, we have the right to suspend or terminate your account and refuse any
								and all current or future use of the Services (or any portion thereof).
							</p>

							<h3 className="font-bold text-xl">4. USER REGISTRATION</h3>

							<p className="leading-7 [&:not(:first-child)]:mt-6">
								You are required to register to use the Services. You agree to keep your password
								confidential and will be responsible for all use of your account and password.
							</p>

							<h3 className="font-bold text-xl">5. PROHIBITED ACTIVITIES</h3>

							<p className="leading-7 [&:not(:first-child)]:mt-6">
								You may not access or use the Services for any purpose other than that for which we
								make the Services available. The Services may not be used in connection with any
								commercial endeavors except those that are specifically endorsed or approved by us.
							</p>

							<p className="leading-7 [&:not(:first-child)]:mt-6">
								As a user of the Services, you agree not to:
							</p>

							<p className="leading-7 [&:not(:first-child)]:mt-6">
								Systematically retrieve data or other content from the Services to create or
								compile, directly or indirectly, a collection, compilation, database, or directory
								without written permission from us.
							</p>

							<ul className="ml-4 mt-4 list-disc space-y-2">
								<li>
									Trick, defraud, or mislead us and other users, especially in any attempt to learn
									sensitive account information such as user passwords.
								</li>
								<li>
									Circumvent, disable, or otherwise interfere with security-related features of the
									Services, including features that prevent or restrict the use or copying of any
									Content or enforce limitations on the use of the Services and/or the Content
									contained therein.
								</li>
								<li>
									Disparage, tarnish, or otherwise harm, in our opinion, us and/or the Services.
								</li>
								<li>
									Use any information obtained from the Services in order to harass, abuse, or harm
									another person.
								</li>
								<li>
									Make improper use of our support services or submit false reports of abuse or
									misconduct.
								</li>
								<li>
									Use the Services in a manner inconsistent with any applicable laws or regulations.
								</li>
								<li>Engage in unauthorized framing of or linking to the Services.</li>
								<li>
									Upload or transmit (or attempt to upload or to transmit) viruses, Trojan horses,
									or other material, including excessive use of capital letters and spamming
									(continuous posting of repetitive text), that interferes with any party’s
									uninterrupted use and enjoyment of the Services or modifies, impairs, disrupts,
									alters, or interferes with the use, features, functions, operation, or maintenance
									of the Services.
								</li>
								<li>
									Engage in any automated use of the system, such as using scripts to send comments
									or messages, or using any data mining, robots, or similar data gathering and
									extraction tools.
								</li>
								<li>Delete the copyright or other proprietary rights notice from any Content.</li>
								<li>
									Attempt to impersonate another user or person or use the username of another user.
								</li>
								<li>
									Upload or transmit (or attempt to upload or to transmit) any material that acts as
									a passive or active information collection or transmission mechanism, including
									without limitation, clear graphics interchange formats (&quot;gifs&quot;), 1×1
									pixels, web bugs, cookies, or other similar devices (sometimes referred to as
									&quot;spyware&quot; or &quot;passive collection mechanisms&quot; or
									&quot;pcms&quot;).
								</li>
								<li>
									Interfere with, disrupt, or create an undue burden on the Services or the networks
									or services connected to the Services.
								</li>
								<li>
									Harass, annoy, intimidate, or threaten any of our employees or agents engaged in
									providing any portion of the Services to you.
								</li>
								<li>
									Attempt to bypass any measures of the Services designed to prevent or restrict
									access to the Services, or any portion of the Services.
								</li>
								<li>
									Except as permitted by applicable law, decipher, decompile, disassemble, or
									reverse engineer any of the software comprising or in any way making up a part of
									the Services.
								</li>
								<li>
									Except as may be the result of standard search engine or Internet browser usage,
									use, launch, develop, or distribute any automated system, including without
									limitation, any spider, robot, cheat utility, scraper, or offline reader that
									accesses the Services, or use or launch any unauthorized script or other software.
								</li>
								<li>Use a buying agent or purchasing agent to make purchases on the Services.</li>
								<li>
									Make any unauthorized use of the Services, including collecting usernames and/or
									email addresses of users by electronic or other means for the purpose of sending
									unsolicited email, or creating user accounts by automated means or under false
									pretenses.
								</li>
								<li>
									Use the Services as part of any effort to compete with us or otherwise use the
									Services and/or the Content for any revenue-generating endeavor or commercial
									enterprise.
								</li>
							</ul>

							<h3 className="font-bold text-xl">6. PRIVACY POLICY</h3>

							<p className="leading-7 [&:not(:first-child)]:mt-6">
								We care about data privacy and security. By using the Services, you agree to be
								bound by our Privacy Policy posted on the Services, which is incorporated into these
								Legal Terms. Please be advised the Services are hosted in the United States and
								France. If you access the Services from any other region of the world with laws or
								other requirements governing personal data collection, use, or disclosure that
								differ from applicable laws in the United States and France, then through your
								continued use of the Services, you are transferring your data to the United States
								and France, and you expressly consent to have your data transferred to and processed
								in the United States and France. Further, we do not knowingly accept, request, or
								solicit information from children or knowingly market to children. Therefore, in
								accordance with the U.S. Children’s Online Privacy Protection Act, if we receive
								actual knowledge that anyone under the age of 13 has provided personal information
								to us without the requisite and verifiable parental consent, we will delete that
								information from the Services as quickly as is reasonably practical.
							</p>

							<h3 className="font-bold text-xl">7. COPYRIGHT INFRINGEMENTS</h3>

							<p className="leading-7 [&:not(:first-child)]:mt-6">
								We respect the intellectual property rights of others. If you believe that any
								material available on or through the Services infringes upon any copyright you own
								or control, please immediately notify us using the contact information provided
								below (a &quot;Notification&quot;). A copy of your Notification will be sent to the
								person who posted or stored the material addressed in the Notification. Please be
								advised that pursuant to applicable law you may be held liable for damages if you
								make material misrepresentations in a Notification. Thus, if you are not sure that
								material located on or linked to by the Services infringes your copyright, you
								should consider first contacting an attorney.
							</p>

							<h3 className="font-bold text-xl">8. TERM AND TERMINATION</h3>

							<p className="leading-7 [&:not(:first-child)]:mt-6">
								These Legal Terms shall remain in full force and effect while you use the Services.
							</p>
							<p className="italic">
								WITHOUT LIMITING ANY OTHER PROVISION OF THESE LEGAL TERMS, WE RESERVE THE RIGHT TO,
								IN OUR SOLE DISCRETION AND WITHOUT NOTICE OR LIABILITY, DENY ACCESS TO AND USE OF
								THE SERVICES (INCLUDING BLOCKING CERTAIN IP ADDRESSES), TO ANY PERSON FOR ANY REASON
								OR FOR NO REASON, INCLUDING WITHOUT LIMITATION FOR BREACH OF ANY REPRESENTATION,
								WARRANTY, OR COVENANT CONTAINED IN THESE LEGAL TERMS OR OF ANY APPLICABLE LAW OR
								REGULATION. WE MAY TERMINATE YOUR USE OR PARTICIPATION IN THE SERVICES OR DELETE
								YOUR ACCOUNT AND ANY CONTENT OR INFORMATION THAT YOU POSTED AT ANY TIME, WITHOUT
								WARNING, IN OUR SOLE DISCRETION.
							</p>

							<p className="leading-7 [&:not(:first-child)]:mt-6">
								If we terminate or suspend your account for any reason, you are prohibited from
								registering and creating a new account under your name, a fake or borrowed name, or
								the name of any third party, even if you may be acting on behalf of the third party.
								In addition to terminating or suspending your account, we reserve the right to take
								appropriate legal action, including without limitation pursuing civil, criminal, and
								injunctive redress.
							</p>

							<h3 className="font-bold text-xl">9. DISCLAIMER</h3>

							<p className="leading-7 [&:not(:first-child)]:mt-6">
								THE SERVICES ARE PROVIDED ON AN AS-IS AND AS-AVAILABLE BASIS. YOU AGREE THAT YOUR
								USE OF THE SERVICES WILL BE AT YOUR SOLE RISK. TO THE FULLEST EXTENT PERMITTED BY
								LAW, WE DISCLAIM ALL WARRANTIES, EXPRESS OR IMPLIED, IN CONNECTION WITH THE SERVICES
								AND YOUR USE THEREOF, INCLUDING, WITHOUT LIMITATION, THE IMPLIED WARRANTIES OF
								MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT. WE MAKE NO
								WARRANTIES OR REPRESENTATIONS ABOUT THE ACCURACY OR COMPLETENESS OF THE SERVICES
								CONTENT OR THE CONTENT OF ANY WEBSITES OR MOBILE APPLICATIONS LINKED TO THE SERVICES
								AND WE WILL ASSUME NO LIABILITY OR RESPONSIBILITY FOR ANY (1) ERRORS, MISTAKES, OR
								INACCURACIES OF CONTENT AND MATERIALS, (2) PERSONAL INJURY OR PROPERTY DAMAGE, OF
								ANY NATURE WHATSOEVER, RESULTING FROM YOUR ACCESS TO AND USE OF THE SERVICES, (3)
								ANY UNAUTHORIZED ACCESS TO OR USE OF OUR SECURE SERVERS AND/OR ANY AND ALL PERSONAL
								INFORMATION AND/OR FINANCIAL INFORMATION STORED THEREIN, (4) ANY INTERRUPTION OR
								CESSATION OF TRANSMISSION TO OR FROM THE SERVICES, (5) ANY BUGS, VIRUSES, TROJAN
								HORSES, OR THE LIKE WHICH MAY BE TRANSMITTED TO OR THROUGH THE SERVICES BY ANY THIRD
								PARTY, AND/OR (6) ANY ERRORS OR OMISSIONS IN ANY CONTENT AND MATERIALS OR FOR ANY
								LOSS OR DAMAGE OF ANY KIND INCURRED AS A RESULT OF THE USE OF ANY CONTENT POSTED,
								TRANSMITTED, OR OTHERWISE MADE AVAILABLE VIA THE SERVICES. WE DO NOT WARRANT,
								ENDORSE, GUARANTEE, OR ASSUME RESPONSIBILITY FOR ANY PRODUCT OR SERVICE ADVERTISED
								OR OFFERED BY A THIRD PARTY THROUGH THE SERVICES, ANY HYPERLINKED WEBSITE, OR ANY
								WEBSITE OR MOBILE APPLICATION FEATURED IN ANY BANNER OR OTHER ADVERTISING, AND WE
								WILL NOT BE A PARTY TO OR IN ANY WAY BE RESPONSIBLE FOR MONITORING ANY TRANSACTION
								BETWEEN YOU AND ANY THIRD-PARTY PROVIDERS OF PRODUCTS OR SERVICES. AS WITH THE
								PURCHASE OF A PRODUCT OR SERVICE THROUGH ANY MEDIUM OR IN ANY ENVIRONMENT, YOU
								SHOULD USE YOUR BEST JUDGMENT AND EXERCISE CAUTION WHERE APPROPRIATE.
							</p>

							<h3 className="font-bold text-xl">10. LIMITATIONS OF LIABILITY</h3>

							<p className="leading-7 [&:not(:first-child)]:mt-6">
								IN NO EVENT WILL WE OR OUR DIRECTORS, EMPLOYEES, OR AGENTS BE LIABLE TO YOU OR ANY
								THIRD PARTY FOR ANY DIRECT, INDIRECT, CONSEQUENTIAL, EXEMPLARY, INCIDENTAL, SPECIAL,
								OR PUNITIVE DAMAGES, INCLUDING LOST PROFIT, LOST REVENUE, LOSS OF DATA, OR OTHER
								DAMAGES ARISING FROM YOUR USE OF THE SERVICES, EVEN IF WE HAVE BEEN ADVISED OF THE
								POSSIBILITY OF SUCH DAMAGES. NOTWITHSTANDING ANYTHING TO THE CONTRARY CONTAINED
								HEREIN, OUR LIABILITY TO YOU FOR ANY CAUSE WHATSOEVER AND REGARDLESS OF THE FORM OF
								THE ACTION, WILL AT ALL TIMES BE LIMITED TO THE AMOUNT PAID, IF ANY, BY YOU TO US
								DURING THE SIX (6) MONTH PERIOD PRIOR TO ANY CAUSE OF ACTION ARISING. CERTAIN US
								STATE LAWS AND INTERNATIONAL LAWS DO NOT ALLOW LIMITATIONS ON IMPLIED WARRANTIES OR
								THE EXCLUSION OR LIMITATION OF CERTAIN DAMAGES. IF THESE LAWS APPLY TO YOU, SOME OR
								ALL OF THE ABOVE DISCLAIMERS OR LIMITATIONS MAY NOT APPLY TO YOU, AND YOU MAY HAVE
								ADDITIONAL RIGHTS.
							</p>

							<h3 className="font-bold text-xl">11. USER DATA</h3>
							<p className="leading-7 [&:not(:first-child)]:mt-6">
								We will maintain certain data that you transmit to the Services for the purpose of
								managing the performance of the Services, as well as data relating to your use of
								the Services. Although we perform regular routine backups of data, you are solely
								responsible for all data that you transmit or that relates to any activity you have
								undertaken using the Services. You agree that we shall have no liability to you for
								any loss or corruption of any such data, and you hereby waive any right of action
								against us arising from any such loss or corruption of such data.
							</p>

							<h3 className="font-bold text-xl">12. CALIFORNIA USERS AND RESIDENTS</h3>

							<p className="leading-7 [&:not(:first-child)]:mt-6">
								If any complaint with us is not satisfactorily resolved, you can contact the
								Complaint Assistance Unit of the Division of Consumer Services of the California
								Department of Consumer Affairs in writing at 1625 North Market Blvd., Suite N 112,
								Sacramento, California 95834 or by telephone at (800) 952-5210 or (916) 445-1254.
							</p>

							<h3 className="font-bold text-xl">13. MISCELLANEOUS</h3>

							<p className="leading-7 [&:not(:first-child)]:mt-6">
								These Legal Terms and any policies or operating rules posted by us on the Services
								or in respect to the Services constitute the entire agreement and understanding
								between you and us. Our failure to exercise or enforce any right or provision of
								these Legal Terms shall not operate as a waiver of such right or provision. These
								Legal Terms operate to the fullest extent permissible by law. We may assign any or
								all of our rights and obligations to others at any time. We shall not be responsible
								or liable for any loss, damage, delay, or failure to act caused by any cause beyond
								our reasonable control. If any provision or part of a provision of these Legal Terms
								is determined to be unlawful, void, or unenforceable, that provision or part of the
								provision is deemed severable from these Legal Terms and does not affect the
								validity and enforceability of any remaining provisions. There is no joint venture,
								partnership, employment or agency relationship created between you and us as a
								result of these Legal Terms or use of the Services. You agree that these Legal Terms
								will not be construed against us by virtue of having drafted them. You hereby waive
								any and all defenses you may have based on the electronic form of these Legal Terms
								and the lack of signing by the parties hereto to execute these Legal Terms.
							</p>

							<h3 className="font-bold text-xl">14. CONTACT US</h3>

							<p className="leading-7 [&:not(:first-child)]:mt-6">
								In order to resolve a complaint regarding the Services or to receive further
								information regarding use of the Services, please contact us at:
							</p>

							<p className="leading-7 [&:not(:first-child)]:mt-6">
								WICKED TECHNOLOGY LIMITED
								<br />
								P.O.BOX 31291 Al Jazeera
								<br />
								Al Hamra, Ras Al Khaima
								<br />
								United Arab Emirates
								<br />
								<i>hey@popcorntime.app</i>
							</p>
						</div>
					</div>
				</div>
			</main>
			<footer className="sticky bottom-0 z-10 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t">
				<div className="mx-auto w-full max-w-6xl px-6 py-4">
					<div className="flex  flex-col items-end gap-3">
						<Button onClick={handleContinue} className="flex items-center">
							<span>{t("tos.accept")}</span>
							{isLoading ? (
								<Spinner className="size-4 text-primary-foreground" />
							) : direction === "rtl" ? (
								<ArrowLeft className="size-4" />
							) : (
								<ArrowRight className="size-4" />
							)}
						</Button>
					</div>
				</div>
			</footer>
		</div>
	);
}

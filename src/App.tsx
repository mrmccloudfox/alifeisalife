import { useEffect, useState } from "react";
import {
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Globe,
  Play,
  Shield,
  // ShoppingBag, // Temporarily removed
} from "lucide-react";

import { REPORTED_DETAILS, STORIES } from "./components/staticData";
import EmailSignup from "./components/EmailSignup";
// Temporarily removed for section simplification
// import SupportBoard from "./components/SupportBoard";
// import TShirtCustomizer from "./components/TShirtCustomizer";

import heroPoemImage from "./assets/images/hero.jpg";
import storyImage1 from "./assets/images/story-1.png";
import storyImage2 from "./assets/images/story-2.png";
import storyImage3 from "./assets/images/story-3.png";

const storyImages = [storyImage3, storyImage2, storyImage1];

export default function App() {
  // Temporarily removed for section simplification
  // const [sessionOrders, setSessionOrders] = useState<any[]>([]);

  // useEffect(() => {
  //   loadOrdersHistory();
  // }, []);

  // const loadOrdersHistory = () => {
  //   setSessionOrders(JSON.parse(localStorage.getItem("tee_orders") || "[]"));
  // };

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#101513] text-[#f4ead9] selection:bg-[#ead6ae] selection:text-[#101513]">
      <main>
        <section className="relative min-h-[640px] overflow-hidden border-b border-white/8 md:min-h-[720px]">
          <img
            src={heroPoemImage}
            alt="Young girl in a dark, cinematic portrait inspired by the poem story"
            className="absolute inset-0 h-full w-full scale-x-[-1] object-cover object-[36%_center]"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(10,13,12,0.98)_0%,rgba(10,13,12,0.82)_34%,rgba(10,13,12,0.18)_66%,rgba(10,13,12,0.20)_100%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_32%,rgba(229,174,105,0.16),transparent_30%),linear-gradient(180deg,transparent_62%,#111614_100%)]" />

          <div className="relative mx-auto flex min-h-[640px] max-w-[1050px] items-center px-5 pb-12 pt-20 md:min-h-[720px]">
            <div className="max-w-[650px]">
              <div className="grid gap-5 md:grid-cols-[1fr_auto] md:items-end">
                <h1 className="max-w-[560px] text-[64px] font-black uppercase leading-[0.89] tracking-normal text-[#f1dfbf] drop-shadow-[0_4px_0_rgba(0,0,0,0.55)] sm:text-[82px] md:text-[96px]">
                  A life is a life,
                  <span className="block text-[#f8f3e7]">no matter how</span>
                  <span className="block text-[#e5c999]">small.</span>
                </h1>
                <div className="mb-4 max-w-[130px] text-[11px] font-extrabold uppercase leading-tight tracking-normal text-[#f2dfba]">
                  3,000,000+ views and counting
                </div>
              </div>

              <p className="mt-5 max-w-[470px] text-[17px] font-medium leading-snug text-[#f6efe4]">
                A t-shirt inspired by a 13-year-old girl's poem about life and the freedom to speak with conviction.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                {/* Temporarily removed for section simplification
                <button
                  onClick={() => scrollToSection("t-shirt-advocacy")}
                  className="rounded-full border border-[#f6ead4] px-6 py-3 text-xs font-black uppercase tracking-normal text-[#f8eddb] transition hover:bg-[#f6ead4] hover:text-[#111614]"
                >
                  Buy the shirt
                </button>
                */}
                <a
                  href={STORIES[2].linkUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full bg-[#ead6ae] px-6 py-3 text-xs font-black uppercase tracking-normal text-[#171410] transition hover:bg-[#f6ead4]"
                >
                  Watch the story
                </a>
              </div>

              <p className="mt-9 max-w-[620px] text-[11px] leading-relaxed text-[#b6aa97]/75">
                Disclaimer: 100% of campaign profits from this shirt, after production, platform, payment processing, taxes, and shipping-related costs, benefit Hope House Colorado, a 501(c)(3) nonprofit.
              </p>
            </div>
          </div>
        </section>

        <section id="story" className="border-b border-white/8 bg-[#111614] py-12 md:py-16">
          <div className="mx-auto max-w-[1050px] px-5">
            <div className="mb-7 flex items-center gap-4">
              <h2 className="shrink-0 text-sm font-black uppercase tracking-normal text-[#d9c094]">The story</h2>
              <div className="h-px flex-1 bg-white/18" />
              <div className="hidden items-center gap-3 text-[#d9c094]/70 sm:flex">
                <ChevronLeft className="h-5 w-5" />
                <ChevronRight className="h-5 w-5" />
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              {STORIES.map((story, index) => (
                <a
                  key={story.id}
                  href={story.linkUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="group text-left"
                >
                  <div className="relative mb-3 aspect-[16/9] overflow-hidden rounded-sm border border-white/8 bg-[#191f1c]">
                    <img
                      src={storyImages[index] || heroPoemImage}
                      alt=""
                        className={[
                        "h-full w-full object-cover opacity-85 transition duration-300 group-hover:scale-105 group-hover:opacity-100",
                        index === 0 ? "object-center" : "",
                        index === 1 ? "object-center" : "",
                        index === 2 ? "object-center" : "",
                      ].join(" ")}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                    <div className="absolute bottom-2 left-3 text-5xl font-black leading-none text-[#f2dfba]">
                      {story.number}
                    </div>
                    <div className="absolute right-3 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-black/45 text-white">
                      <Play className="h-4 w-4 fill-current" />
                    </div>
                  </div>
                  <h3 className="text-[22px] font-black leading-[0.98] tracking-normal text-[#f5ead6]">
                    {story.title}
                  </h3>
                  <p className="mt-2 text-[13px] leading-snug text-[#a9a095]">{story.description}</p>
                  <span className="mt-2 inline-flex items-center gap-1 border-b border-[#d9c094]/50 text-xs font-bold text-[#d9c094]">
                    {story.linkText} <ArrowUpRight className="h-3 w-3" />
                  </span>
                </a>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#111614] py-12 md:py-16">
          <div className="mx-auto max-w-[1050px] px-5">
            <div className="mb-10 flex items-center gap-6">
              <div className="h-px flex-1 bg-white/16" />
              <span className="text-2xl text-[#d9c094]/70">✦</span>
              <div className="h-px flex-1 bg-white/16" />
            </div>

            <div className="grid gap-7 md:grid-cols-[0.7fr_1.3fr]">
              <div>
                <p className="text-sm font-black uppercase tracking-normal text-[#d9c094]">Reported details</p>
                <h2 className="mt-3 max-w-[260px] text-3xl font-black leading-none tracking-normal text-[#f6ead6]">
                  The story traveled fast.
                </h2>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {REPORTED_DETAILS.map((detail) => (
                  <a
                    key={detail.id}
                    href={detail.href || undefined}
                    target={detail.href ? "_blank" : undefined}
                    rel={detail.href ? "noreferrer" : undefined}
                    className="min-h-[136px] rounded-md border border-white/16 bg-white/[0.025] p-5 transition hover:border-[#d9c094]/70 hover:bg-white/[0.045]"
                  >
                    <p className="text-xs font-black uppercase tracking-normal text-[#d9c094]">{detail.source}</p>
                    <p className="mt-3 text-[13px] leading-snug text-[#c8bdaa]">{detail.quote}</p>
                    <p className="mt-4 inline-flex items-center gap-1 text-[11px] font-bold text-[#f0dfbf]/80">
                      {detail.href ? "Open source" : "Source noted in PDF"} <ArrowUpRight className="h-3 w-3" />
                    </p>
                  </a>
                ))}
              </div>
            </div>

            <div className="mx-auto mt-14 max-w-[760px] text-center">
              <div className="text-4xl font-black text-[#ead6ae]">“</div>
              <blockquote className="text-3xl font-black leading-tight tracking-normal text-[#f8efdf] md:text-4xl">
                There is hope in hard situations. There is purpose in pain. Good things come out of situations that seem bleak.
              </blockquote>
            </div>
          </div>
        </section>

        <section id="donation-benefit" className="border-y border-white/8 bg-[#111614] py-12 md:py-16">
          <div className="mx-auto max-w-[1050px] px-5">
            <div className="mb-9 flex items-center gap-6">
              <div className="h-px flex-1 bg-white/16" />
              <span className="text-2xl text-[#d9c094]/70">✦</span>
              <div className="h-px flex-1 bg-white/16" />
            </div>

            <div className="grid gap-7 md:grid-cols-[0.7fr_1.3fr]">
              <h2 className="max-w-[270px] text-3xl font-black uppercase leading-[0.95] tracking-normal text-[#e8c995]">
                Benefiting Hope House Colorado
              </h2>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-md border border-white/16 bg-white/[0.025] p-6">
                  <p className="text-[14px] leading-relaxed text-[#c8bdaa]">
                    Hope House Colorado works with parenting teen moms, offering free self-sufficiency programming and support for healthy futures for both moms and children.
                  </p>
                </div>
                <div className="rounded-md border border-white/16 bg-white/[0.025] p-6">
                  <p className="text-[14px] leading-relaxed text-[#c8bdaa]">
                    Hope House Colorado lists itself as a 501(c)(3) nonprofit. The fundraiser should launch only after Hope House approves use of its name for this campaign.
                  </p>
                  <a
                    href="https://hopehousecolorado.org/"
                    target="_blank"
                    rel="noreferrer"
                    className="mt-5 inline-flex items-center gap-2 text-sm font-black text-[#f0dfbf]"
                  >
                    <Globe className="h-4 w-4" />
                    Visit Hope House Colorado
                    <ArrowUpRight className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-t border-white/8 bg-[#111614] py-12 md:py-16">
          <div className="mx-auto max-w-[1050px] px-5">
            <EmailSignup />
          </div>
        </section>

        {/* Temporarily removed for section simplification
        <section id="t-shirt-advocacy" className="bg-[#0d1110] py-16 md:py-20">
          <div className="mx-auto max-w-[1050px] px-5">
            <div className="mx-auto mb-10 max-w-[580px] text-center">
              <p className="text-sm font-black uppercase tracking-normal text-[#d9c094]">Buy the shirt</p>
              <h2 className="mt-3 text-4xl font-black leading-none text-[#f8efdf]">Turn the message into support.</h2>
              <p className="mt-4 text-sm leading-relaxed text-[#afa596]">
                Configure a shirt and estimate the campaign contribution before ordering.
              </p>
            </div>
            <TShirtCustomizer onOrderSuccess={loadOrdersHistory} />
          </div>
        </section>
        */}

        {/* Temporarily removed for section simplification
        <section id="community-board" className="border-t border-white/8 bg-[#111614] py-16">
          <div className="mx-auto max-w-[1050px] px-5">
            <div className="mb-9 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-sm font-black uppercase tracking-normal text-[#d9c094]">Encouragement board</p>
                <h2 className="mt-2 text-4xl font-black leading-none text-[#f8efdf]">Leave a note of support.</h2>
              </div>
              <p className="max-w-[410px] text-sm leading-relaxed text-[#afa596]">
                Share a reflection for the student, teenage mothers, and families connected to Hope House Colorado.
              </p>
            </div>
            <SupportBoard />
          </div>
        </section>
        */}

        {/* Temporarily removed for section simplification
        {sessionOrders.length > 0 && (
          <section className="border-t border-white/8 bg-[#0d1110] py-14">
            <div className="mx-auto max-w-[1050px] px-5">
              <div className="mb-5 flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-[#d9c094]" />
                <h3 className="text-xl font-black text-[#f8efdf]">Your campaign orders</h3>
              </div>
              <div className="overflow-hidden rounded-md border border-white/12">
                {sessionOrders.map((order) => (
                  <div key={order.orderId} className="border-b border-white/8 p-5 last:border-b-0 sm:flex sm:items-center sm:justify-between">
                    <div>
                      <p className="text-xs font-black text-[#d9c094]">{order.orderId}</p>
                      <p className="mt-1 text-sm text-[#d6cab8]">
                        {order.shippingName} - Size {order.size} ({order.color})
                      </p>
                    </div>
                    <p className="mt-3 text-lg font-black text-[#f0dfbf] sm:mt-0">${order.totalPrice}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
        */}
      </main>

      <footer className="bg-[#080a09] px-5 py-9 text-center text-xs text-[#9d9385]">
        <div className="mx-auto max-w-[760px]">
          <p className="font-black uppercase text-[#d9c094]">No Matter How Small - A Benefit for Hope House</p>
          <p className="mt-3 leading-relaxed">
            <Shield className="mr-1 inline h-3.5 w-3.5" />
            100% of campaign profits, after production/platform/payment/tax/shipping costs, benefit Hope House Colorado. Estimated benefit: $X per shirt. Printed and fulfilled by the selected platform.
          </p>
        </div>
      </footer>
    </div>
  );
}

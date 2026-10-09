import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Provas from "@/components/Provas";
import Programacao from "@/components/Programacao";
import KitPremios from "@/components/KitPremios";
import ComoParticipar from "@/components/ComoParticipar";
import Faq from "@/components/Faq";
import CtaFinal from "@/components/CtaFinal";
import Footer from "@/components/Footer";
import StickyCta from "@/components/StickyCta";
import RevealObserver from "@/components/RevealObserver";

export default function Home() {
  return (
    <>
      <a className="skip-link" href="#conteudo">
        Pular para o conteúdo
      </a>

      <Navbar />

      <main id="conteudo">
        <Hero />
        <Provas />
        <Programacao />
        <KitPremios />
        <ComoParticipar />
        <Faq />
        <CtaFinal />
      </main>

      <Footer />
      <StickyCta />
      <RevealObserver />
    </>
  );
}

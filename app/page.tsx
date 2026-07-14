import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Sobre from "@/components/Sobre";
import Beneficios from "@/components/Beneficios";
import Percursos from "@/components/Percursos";
import Programacao from "@/components/Programacao";
import CtaFinal from "@/components/CtaFinal";
import Footer from "@/components/Footer";
import SmoothScroll from "@/components/SmoothScroll";

export default function Home() {
  return (
    <>
      <a className="skip-link" href="#conteudo">
        Pular para o conteúdo
      </a>

      <SmoothScroll />
      <Navbar />

      <main id="conteudo">
        <Hero />
        <Sobre />
        <Beneficios />
        <Percursos />
        <Programacao />
        <CtaFinal />
      </main>

      <Footer />
    </>
  );
}

"use client";

/* Registro central do GSAP — importe sempre daqui para garantir
   que os plugins estejam registrados uma única vez. */
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger, MotionPathPlugin, SplitText);

export { gsap, ScrollTrigger, MotionPathPlugin, SplitText, useGSAP };

"use client";
import Hero from "../components/sections/hero/Hero";
import Docs from "../components/sections/doc/Docs";
import AllDocs from "../components/sections/doc/AllDocs";
import TopTabs, { TopTabKey } from "../components/ui/topTab/TopTabs";
import { useState } from "react";
import NeonVoidGame from "../components/games/neon-void";

export default function Home() {
  const [active, setActive] = useState<TopTabKey>("home");

  return (
    <main>
      <TopTabs active={active} onChange={setActive} />
      <section hidden={active !== "home"}>
        <Hero />
        <NeonVoidGame />
        <Docs
          onLoadMore={() => {
            setActive("all");
            requestAnimationFrame(() => {
              window.scrollTo({ top: 0 });
            });
          }}
        />
      </section>
      <section hidden={active !== "all"}>
        <AllDocs />
      </section>
    </main>
  );
}

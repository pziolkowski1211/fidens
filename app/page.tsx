export default function Home() {
  return (
    <main className="min-h-screen" style={{backgroundColor: '#f8f9fb'}}>
      
      {/* NAWIGACJA */}
      <nav style={{backgroundColor: '#1B2A4A'}} className="px-6 py-4 flex items-center justify-between">
  <div style={{color: '#F0A500', fontSize: '24px', fontWeight: '700', letterSpacing: '2px'}}>
    FIDENS
  </div>
  <div className="flex gap-8">
    <a href="/leasing" style={{color: 'rgba(255,255,255,0.8)', fontSize: '14px'}}>Jak działa leasing</a>
    <a href="/o-nas" style={{color: 'rgba(255,255,255,0.8)', fontSize: '14px'}}>O nas</a>
    <a href="/kontakt" style={{color: 'rgba(255,255,255,0.8)', fontSize: '14px'}}>Kontakt</a>
  </div>
  <a href="/kontakt" style={{backgroundColor: '#F0A500', color: '#1B2A4A', padding: '8px 20px', borderRadius: '6px', fontWeight: '600', fontSize: '14px'}}>
    Zamów bezpłatną kalkulację
  </a>
</nav>

{/* HERO */}
<section style={{backgroundColor: '#1B2A4A'}} className="px-6 py-20 text-center">
  <h1 style={{color: '#ffffff', fontSize: '48px', fontWeight: '700', lineHeight: '1.2', marginBottom: '16px'}}>
    Finansowanie pojazdów<br/>i maszyn budowlanych
  </h1>
  <p style={{color: 'rgba(255,255,255,0.6)', fontSize: '18px', marginBottom: '16px'}}>
    Leasing, kredyt, wynajem — szybka decyzja kredytowa.<br/>Ty wybierasz pojazd, my zajmujemy się resztą.
  </p>
</section>

      {/* OGŁOSZENIE TYGODNIA */}
      <section className="px-6 py-12" style={{backgroundColor: '#ffffff'}}>
        <div style={{maxWidth: '1100px', margin: '0 auto'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px'}}>
            <h2 style={{fontSize: '24px', fontWeight: '700', color: '#1B2A4A'}}>Ogłoszenie tygodnia</h2>
            <span style={{backgroundColor: '#F0A500', color: '#1B2A4A', fontSize: '11px', fontWeight: '700', padding: '3px 10px', borderRadius: '20px'}}>Wyróżnione</span>
          </div>
          <div style={{backgroundColor: '#f8f9fb', borderRadius: '12px', border: '1px solid #e8eaed', display: 'flex', overflow: 'hidden'}}>
            <div style={{width: '400px', backgroundColor: '#e8eaed', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <span style={{color: '#aaa', fontSize: '13px'}}>Zdjęcie pojazdu</span>
            </div>
            <div style={{padding: '32px'}}>
              <div style={{fontSize: '11px', backgroundColor: '#F0A500', color: '#1B2A4A', padding: '3px 10px', borderRadius: '3px', display: 'inline-block', marginBottom: '12px', fontWeight: '700'}}>Ogłoszenie tygodnia</div>
              <h3 style={{fontSize: '28px', fontWeight: '700', color: '#1B2A4A', marginBottom: '8px'}}>BMW 5 Series 530d xDrive</h3>
              <p style={{fontSize: '14px', color: '#888', marginBottom: '20px'}}>2022 · 68 000 km · Diesel · Automat · Salon Polska</p>
              <div style={{fontSize: '36px', fontWeight: '700', color: '#1B2A4A', marginBottom: '4px'}}>1 890 zł <span style={{fontSize: '16px', color: '#888', fontWeight: '400'}}>/miesiąc</span></div>
              <p style={{fontSize: '12px', color: '#bbb', marginBottom: '24px'}}>Cena pojazdu dostępna po kontakcie</p>
              <button style={{backgroundColor: '#F0A500', color: '#1B2A4A', padding: '14px 32px', borderRadius: '8px', fontSize: '15px', fontWeight: '700', border: 'none', cursor: 'pointer'}}>
                Sprawdź ofertę →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* NAJNOWSZE OFERTY */}
      <section className="px-6 py-12">
        <div style={{maxWidth: '1100px', margin: '0 auto'}}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px'}}>
            <h2 style={{fontSize: '24px', fontWeight: '700', color: '#1B2A4A'}}>Najnowsze oferty</h2>
            <a href="/ogloszenia" style={{color: '#F0A500', fontSize: '14px', fontWeight: '600'}}>Zobacz wszystkie →</a>
          </div>
          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px'}}>
            {[
              {nazwa: 'Audi A6 40 TDI', rok: '2021', przebieg: '95 000 km', rata: '1 490', badge: 'Nowe'},
              {nazwa: 'Volvo FH 500', rok: '2020', przebieg: '410 000 km', rata: '3 200', badge: 'Nowe'},
              {nazwa: 'Caterpillar 320', rok: '2019', przebieg: 'Koparka', rata: '4 100', badge: 'Promocja'},
            ].map((auto) => (
              <div key={auto.nazwa} style={{backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e8eaed', overflow: 'hidden', cursor: 'pointer'}}>
                <div style={{height: '180px', backgroundColor: '#e8eaed', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                  <span style={{color: '#aaa', fontSize: '13px'}}>Zdjęcie pojazdu</span>
                </div>
                <div style={{padding: '16px'}}>
                  <div style={{fontSize: '10px', backgroundColor: auto.badge === 'Promocja' ? '#fff3e0' : '#e8f4e8', color: auto.badge === 'Promocja' ? '#e65100' : '#2a7a2a', padding: '2px 8px', borderRadius: '3px', display: 'inline-block', marginBottom: '8px'}}>{auto.badge}</div>
                  <div style={{fontSize: '16px', fontWeight: '700', color: '#1B2A4A', marginBottom: '4px'}}>{auto.nazwa}</div>
                  <div style={{fontSize: '13px', color: '#888', marginBottom: '12px'}}>{auto.rok} · {auto.przebieg}</div>
                  <div style={{fontSize: '22px', fontWeight: '700', color: '#1B2A4A'}}>{auto.rata} zł <span style={{fontSize: '13px', color: '#888', fontWeight: '400'}}>/msc</span></div>
                  <button style={{marginTop: '12px', width: '100%', backgroundColor: '#1B2A4A', color: '#fff', padding: '10px', borderRadius: '6px', fontSize: '13px', fontWeight: '600', border: 'none', cursor: 'pointer'}}>
                    Sprawdź ofertę
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* JAK TO DZIAŁA */}
      <section style={{backgroundColor: '#1B2A4A'}} className="px-6 py-16">
        <div style={{maxWidth: '1100px', margin: '0 auto', textAlign: 'center'}}>
          <h2 style={{color: '#ffffff', fontSize: '32px', fontWeight: '700', marginBottom: '48px'}}>Jak to działa?</h2>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '16px', alignItems: 'start'}}>
            {[
              {nr: '1', tekst: 'Złóż wniosek online'},
              {nr: '2', tekst: 'Decyzja w 60 minut'},
              {nr: '3', tekst: 'Podpisz umowę'},
              {nr: '4', tekst: 'Wpłać opłatę wstępną'},
              {nr: '5', tekst: 'Rejestrujemy i ubezpieczamy'},
              {nr: '6', tekst: 'Pojazd gotowy do drogi'},
            ].map((krok, i) => (
              <div key={krok.nr} style={{position: 'relative'}}>
                <div style={{width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#F0A500', color: '#1B2A4A', fontSize: '18px', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px'}}>
                  {krok.nr}
                </div>
                <div style={{color: 'rgba(255,255,255,0.85)', fontSize: '13px', lineHeight: '1.4'}}>
                  {krok.tekst}
                </div>
                {i < 5 && (
                  <div style={{position: 'absolute', top: '20px', right: '-8px', color: '#F0A500', fontSize: '20px'}}>›</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* OPINIE */}
      <section className="px-6 py-16" style={{backgroundColor: '#ffffff'}}>
        <div style={{maxWidth: '1100px', margin: '0 auto'}}>
          <h2 style={{fontSize: '32px', fontWeight: '700', color: '#1B2A4A', textAlign: 'center', marginBottom: '48px'}}>Opinie klientów</h2>
          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '24px'}}>
            {[
              {tekst: 'Ekspresowa decyzja, zero stresu. Polecam każdemu przedsiębiorcy.', imie: 'Marek K.', miasto: 'Warszawa'},
              {tekst: 'Wszystko załatwione w jeden dzień. Auto stało pod domem następnego dnia.', imie: 'Tomasz W.', miasto: 'Kraków'},
              {tekst: 'Profesjonalne podejście, najlepsza oferta leasingu jaką znalazłem.', imie: 'Anna P.', miasto: 'Wrocław'},
            ].map((opinia) => (
              <div key={opinia.imie} style={{backgroundColor: '#f8f9fb', borderRadius: '12px', padding: '24px', border: '1px solid #e8eaed'}}>
                <div style={{color: '#F0A500', fontSize: '18px', marginBottom: '12px'}}>★★★★★</div>
                <p style={{fontSize: '14px', color: '#555', lineHeight: '1.6', marginBottom: '16px', fontStyle: 'italic'}}>"{opinia.tekst}"</p>
                <div style={{fontSize: '13px', fontWeight: '600', color: '#1B2A4A'}}>{opinia.imie}, {opinia.miasto}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STOPKA */}
      <footer style={{backgroundColor: '#1B2A4A'}} className="px-6 py-10">
        <div style={{maxWidth: '1100px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <div style={{color: '#F0A500', fontSize: '20px', fontWeight: '700', letterSpacing: '2px'}}>FIDENS</div>
          <div className="flex gap-8">
            <a href="/o-nas" style={{color: 'rgba(255,255,255,0.5)', fontSize: '13px'}}>O mnie</a>
            <a href="/kontakt" style={{color: 'rgba(255,255,255,0.5)', fontSize: '13px'}}>Kontakt</a>
            <a href="/regulamin" style={{color: 'rgba(255,255,255,0.5)', fontSize: '13px'}}>Regulamin</a>
            <a href="/polityka" style={{color: 'rgba(255,255,255,0.5)', fontSize: '13px'}}>Polityka prywatności</a>
          </div>
          <div style={{color: 'rgba(255,255,255,0.3)', fontSize: '12px'}}>© 2026 Fidens. Wszelkie prawa zastrzeżone.</div>
        </div>
      </footer>

    </main>
  );
}
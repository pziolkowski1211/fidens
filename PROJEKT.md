## Szczegóły techniczne

### Pliki w app/
- page.tsx (strona główna)
- layout.tsx
- globals.css
- Brak podstron i komponentów na razie

### Responsywność
Strona musi działać na desktop I mobile (klienci przychodzą z social mediów = głównie telefon)
Hamburger menu na mobile do zrobienia

### Zdjęcia ogłoszeń
Uploadowane przez panel admina do Supabase Storage
Możliwość wgrania ręcznie LUB import z OtoMoto (osobno)

### Panel admina
Zabezpieczony logowaniem — tylko właściciel
Logowanie przez Supabase Auth

### Formularz kontaktowy
Przez Resend (darmowy do 3000 maili/msc)
Mail zawiera: dane pojazdu + parametry leasingu które ustawił klient

### Import z OtoMoto
Brak oficjalnego API — podajesz link do ogłoszenia
Automatyczne pobieranie danych (scraping)
Zdjęcia wgrywane osobno ręcznie (inne niż na OtoMoto!)
Synchronizacja — ogłoszenie znika z OtoMoto = znika z Fidens
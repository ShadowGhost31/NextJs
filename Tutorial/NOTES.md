NOTES.md — NEXT.JS FOUNDATIONS (APP ROUTER)

Правило: у папці screenshots/ зберігаю РІВНО 30 головних скрінів. Назви — фіксовані (див. нижче).
Для кожного скріна тут є короткий опис, що саме на ньому має бути видно.

============================================================
СПИСОК 30 ГОЛОВНИХ СКРІНШОТІВ (файли)
============================================================

01-ch00-repo-created.png
- GitHub: створений окремий репозиторій для туторіалу (видно назву репо).

02-ch01-create-next-app.png
- Terminal: команда create-next-app з --example і успішне завершення.

03-ch01-home-localhost.png
- Browser: http://localhost:3000 працює (видно URL).

04-ch02-global-css-import.png
- VS Code: app/layout.tsx з import '@/app/ui/global.css'.

05-ch02-tailwind-triangle-ui.png
- Browser: на головній сторінці видно “трикутник” (Tailwind).

06-ch02-css-modules-triangle-code.png
- VS Code: app/ui/home.module.css + у app/page.tsx використання styles.shape.

07-ch03-fonts-inter-lusitana.png
- VS Code: app/ui/fonts.ts з Inter та Lusitana (ваги 400/700).

08-ch03-devtools-fonts.png
- Browser DevTools: у body видно Inter/Inter_Fallback у стилях (Elements/Computed).

09-ch03-hero-desktop.png
- Browser: desktop-версія з hero-desktop.png (видно URL).

10-ch03-hero-mobile.png
- Browser DevTools: mobile mode (responsive) з hero-mobile.png.

11-ch04-dashboard-routes-tree.png
- VS Code: дерево папок app/dashboard, customers, invoices (видно структуру).

12-ch04-dashboard-layout-ui.png
- Browser: /dashboard з SideNav і контентом (видно URL).

13-ch05-navlinks-link-and-active-code.png
- VS Code: app/ui/dashboard/nav-links.tsx з <Link>, usePathname, clsx, 'use client'.

14-ch05-active-link-ui.png
- Browser: активний пункт меню підсвічений (видно URL).

15-ch06-github-commits.png
- GitHub: видно історію комітів (кілька комітів по главах).

16-ch06-vercel-deploy-success.png
- Vercel: успішний Deploy / Project overview.

17-ch06-vercel-postgres-created.png
- Vercel: Storage → Postgres створено (видно назву бази/статус).

18-ch06-seed-success.png
- Browser: /seed показує “Database seeded successfully”.

19-ch08-slow-fetch-terminal.png
- Terminal: лог “Fetching revenue data...” і “Data fetch completed after 3 seconds.”

20-ch09-dashboard-loading-skeleton.png
- Browser: /dashboard показує skeleton (loading.tsx + DashboardSkeleton).

21-ch09-route-group-overview-tree.png
- VS Code: папка app/dashboard/(overview)/ і що loading.tsx застосовується лише до overview.

22-ch09-suspense-revenue-skeleton.png
- Browser: видно cards/LatestInvoices, а RevenueChart ще skeleton (Suspense працює).

23-ch10-search-url-updates.png
- Browser: /dashboard/invoices?query=... (URL змінюється при пошуку).

24-ch10-debounce-console.png
- Browser DevTools Console: після debounce лог “Searching... Delba” лише один раз.

25-ch10-pagination-ui.png
- Browser: /dashboard/invoices?page=2 (пагінація працює, видно URL).

26-ch11-create-invoice-success.png
- Browser: після Create Invoice видно новий інвойс у таблиці (або факт редіректу на /dashboard/invoices).

27-ch11-delete-invoice-success.png
- Browser: натиснув Delete і запис зник / таблиця перерендерилась.

28-ch12-error-or-notfound-ui.png
- Browser: або error.tsx “Something went wrong!”, або not-found.tsx “404 Not Found”.

29-ch14-auth-redirect-login.png
- Browser: спроба відкрити /dashboard без логіну → редірект на /login?callbackUrl=...

30-ch15-metadata-head.png
- Browser DevTools: вкладка Elements, <head> — видно title “... | Acme Dashboard” + favicon.

============================================================
КОРОТКІ НОТАТКИ ПО ГЛАВАХ (пишу своїми словами)
============================================================

Chapter 1 — Setup
- Що зробив(ла):
- Скріншоти: 02, 03
- Питання/думки:

Chapter 2 — CSS Styling
- Що зробив(ла):
- Скріншоти: 04, 05, 06
- Питання/думки:

Chapter 3 — Fonts & Images
- Що зробив(ла):
- Скріншоти: 07, 08, 09, 10
- Питання/думки:

Chapter 4 — Layouts & Pages
- Що зробив(ла):
- Скріншоти: 11, 12
- Питання/думки:

Chapter 5 — Navigation
- Що зробив(ла):
- Скріншоти: 13, 14
- Питання/думки:

Chapter 6 — Database setup (Vercel Postgres) + seed
- Що зробив(ла):
- Скріншоти: 15, 16, 17, 18
- Питання/думки:

Chapter 8 — Static/Dynamic Rendering
- Що зробив(ла):
- Скріншоти: 19
- Питання/думки:

Chapter 9 — Streaming
- Що зробив(ла):
- Скріншоти: 20, 21, 22
- Питання/думки:

Chapter 10 — Search & Pagination
- Що зробив(ла):
- Скріншоти: 23, 24, 25
- Питання/думки:

Chapter 11 — Mutating Data (Server Actions)
- Що зробив(ла):
- Скріншоти: 26, 27
- Питання/думки:

Chapter 12 — Error handling
- Що зробив(ла):
- Скріншоти: 28
- Питання/думки:

Chapter 14 — Authentication
- Що зробив(ла):
- Скріншоти: 29
- Питання/думки:

Chapter 15 — Metadata
- Що зробив(ла):
- Скріншоти: 30
- Питання/думки:


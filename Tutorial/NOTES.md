NOTES.md — NEXT.JS FOUNDATIONS (APP ROUTER)


Для кожного скріна тут є короткий опис, що саме на ньому має бути видно.

============================================================
СПИСОК ГОЛОВНИХ СКРІНШОТІВ
============================================================

01-ch00-repo-created.png  
- GitHub: створений окремий репозиторій для туторіалу (видно назву репо).  
![01-ch00-repo-created](./screenshots/01-ch00-repo-created.png)

02-ch01-create-next-app.png  
- Terminal: команда create-next-app з --example і успішне завершення.  
![02-ch01-create-next-app](./screenshots/02-ch01-create-next-app.png)

03-ch01-home-localhost.png  
- Browser: http://localhost:3000 працює (видно URL).  
![03-ch01-home-localhost](./screenshots/03-ch01-home-localhost.png)

04-ch02-global-css-import.png  
- Browser/VS Code: app/layout.tsx з import '@/app/ui/global.css' видно стилі.  
![04-ch02-global-css-import](./screenshots/04-ch02-global-css-import.png)

05-ch02-tailwind-triangle-ui.png  
- Browser: на головній сторінці видно “трикутник” (Tailwind).  
![05-ch02-tailwind-triangle-ui](./screenshots/05-ch02-tailwind-triangle-ui.png)

06-ch02-css-modules-triangle-code.png  
- VS Code: app/ui/home.module.css + у app/page.tsx використання styles.shape.  
![06-ch02-css-modules-triangle-code](./screenshots/06-ch02-css-modules-triangle-code.png)

06-1-ch02-triangle-ui.png  
- Browser: на головній сторінці видно “трикутник” вже від іншого коду.  
![06-1-ch02-triangle-ui](./screenshots/06-1-ch02-triangle-ui.png)

07-ch03-fonts-inter-lusitana.png  
- VS Code: app/ui/fonts.ts з Inter та Lusitana (ваги 400/700).  
![07-ch03-fonts-inter-lusitana](./screenshots/07-ch03-fonts-inter-lusitana.png)

07-1-ch03-fonts.png  
- VS Code: оновлення коду шрифтів.  
![07-1-ch03-fonts](./screenshots/07-1-ch03-fonts.png)

08-ch03-devtools-fonts.png  
- Browser DevTools: у body видно Inter/Inter_Fallback у стилях (Elements/Computed).  
![08-ch03-devtools-fonts](./screenshots/08-ch03-devtools-fonts.png)

09-ch03-hero-desktop.png  
- Browser: desktop-версія з hero-desktop.png (видно URL).  
![09-ch03-hero-desktop](./screenshots/09-ch03-hero-desktop.png)

10-ch03-hero-mobile.png  
- Browser DevTools: mobile mode (responsive) з hero-mobile.png.  
![10-ch03-hero-mobile](./screenshots/10-ch03-hero-mobile.png)

11-ch04-dashboard-routes-tree.png  
- VS Code: дерево папок app/dashboard, customers, invoices (видно структуру).  
![11-ch04-dashboard-routes-tree](./screenshots/11-ch04-dashboard-routes-tree.png)

12-ch04-dashboard-layout-ui.png  
- Browser: /dashboard з SideNav і контентом (видно URL).  
![12-ch04-dashboard-layout-ui](./screenshots/12-ch04-dashboard-layout-ui.png)

13-ch05-navlinks-link-and-active-code.png  
- VS Code: app/ui/dashboard/nav-links.tsx з <Link>, usePathname, clsx, 'use client'.  
![13-ch05-navlinks-link-and-active-code](./screenshots/13-ch05-navlinks-link-and-active-code.png)

14-ch05-active-link-ui.png  
- Browser: активний пункт меню підсвічений (видно URL).  
![14-ch05-active-link-ui](./screenshots/14-ch05-active-link-ui.png)

15-ch06-github-commits.png  
- GitHub: видно історію комітів (кілька комітів по главах).  
![15-ch06-github-commits](./screenshots/15-ch06-github-commits.png)

16-ch06-vercel-deploy-success.png  
- Vercel: успішний Deploy / Project overview.  
![16-ch06-vercel-deploy-success](./screenshots/16-ch06-vercel-deploy-success.png)

17-ch06-vercel-postgres-created.png  
- Vercel: Storage → Postgres створено (видно назву бази/статус).  
![17-ch06-vercel-postgres-created](./screenshots/17-ch06-vercel-postgres-created.png)

18-ch06-seed-success.png  
- Browser: /seed показує “Database seeded successfully”.  
![18-ch06-seed-success](./screenshots/18-ch06-seed-success.png)

19-ch08-slow-fetch-terminal.png  
- Terminal: лог “Fetching revenue data...” і “Data fetch completed after 3 seconds.”  
![19-ch08-slow-fetch-terminal](./screenshots/19-ch08-slow-fetch-terminal.png)

20-ch09-dashboard-loading-skeleton.png  
- VS Code: /dashboard додаю skeleton (loading.tsx + DashboardSkeleton).  
![20-ch09-dashboard-loading-skeleton](./screenshots/20-ch09-dashboard-loading-skeleton.png)

21-ch09-route-group-overview-tree.png  
- VS Code: папка app/dashboard/(overview)/ і що loading.tsx застосовується лише до overview.  
![21-ch09-route-group-overview-tree](./screenshots/21-ch09-route-group-overview-tree.png)

22-1-ch09-suspense.png  
- Browser: видно cards/LatestInvoices, RevenueChart.  
![22-1-ch09-suspense](./screenshots/22-1-ch09-suspense.png)

22-ch09-suspense-revenue-skeleton.png  
- Browser: видно cards/LatestInvoices, а RevenueChart ще skeleton (Suspense працює).  
![22-ch09-suspense-revenue-skeleton](./screenshots/22-ch09-suspense-revenue-skeleton.png)

23-ch10-search-url-updates.png  
- Browser: /dashboard/invoices?query=... (URL змінюється при пошуку).  
![23-ch10-search-url-updates](./screenshots/23-ch10-search-url-updates.png)

24-ch10-debounce-console.png  
- Browser DevTools Console: після debounce лог “Searching... Delba” лише один раз.  
![24-ch10-debounce-console](./screenshots/24-ch10-debounce-console.png)

25-ch10-pagination-ui.png  
- Browser: /dashboard/invoices?page=2 (пагінація працює, видно URL).  
![25-ch10-pagination-ui](./screenshots/25-ch10-pagination-ui.png)

26-ch11-create-invoice-success.png  
- Browser: після Create Invoice видно новий інвойс у таблиці (або факт редіректу).  
![26-ch11-create-invoice-success](./screenshots/26-ch11-create-invoice-success.png)

27-ch11-delete-invoice-success.png  
- Browser: натиснув Delete і запис зник / таблиця перерендерилась.  
![27-ch11-delete-invoice-success](./screenshots/27-ch11-delete-invoice-success.png)

28-ch12-error-or-notfound-ui.png  
- Browser: або error.tsx “Something went wrong!”, або not-found.tsx “404 Not Found”.  
![28-ch12-error-or-notfound-ui](./screenshots/28-ch12-error-or-notfound-ui.png)

29-ch14-auth-redirect-login.png  
- Browser: спроба відкрити /dashboard без логіну → редірект на /login?callbackUrl=...  
![29-ch14-auth-redirect-login](./screenshots/29-ch14-auth-redirect-login.png)

30-ch15-metadata-head.png  
- Browser DevTools: <head> — видно title “... | Acme Dashboard” + favicon.  
![30-ch15-metadata-head](./screenshots/30-ch15-metadata-head.png)

============================================================
КОРОТКІ НОТАТКИ ПО ГЛАВАХ 
============================================================

Chapter 1 — Setup
- Що зробив: Встановив pnpm, створив проєкт nextjs-dashboard зі starter example та запустив dev server.
- Скріншоти: 02, 03
- Питання/думки: Зручно, що starter вже містить готову структуру — більше часу йде на вивчення фіч Next.js.

Chapter 2 — CSS Styling
- Що зробив: Підключив global.css у root layout, спробував Tailwind utility-класи та повторив те саме через CSS Modules.
- Скріншоти: 04, 05, 06
- Питання/думки: Tailwind швидший для прототипів, а CSS Modules зручніші, коли треба ізолювати стилі компонента.

Chapter 3 — Fonts & Images
- Що зробив: Додав шрифти Inter і Lusitana через next/font та підключив hero-зображення через next/image для desktop/mobile.
- Скріншоти: 07, 08, 09, 10
- Питання/думки: next/font і next/image зменшують layout shift і оптимізують завантаження без ручної мороки.

Chapter 4 — Layouts & Pages
- Що зробив: Створив маршрути dashboard/customers/invoices та зробив спільний layout з SideNav для розділу dashboard.
- Скріншоти: 11, 12
- Питання/думки: Папкова маршрутизація проста і наочно показує структуру сайту без окремого router-конфігу.

Chapter 5 — Navigation
- Що зробив: Замінив <a> на <Link> для клієнтської навігації та додав підсвітку активного пункту меню через usePathname + clsx.
- Скріншоти: 13, 14
- Питання/думки: Переходи відчуваються “як SPA”, але рендер все одно залишається серверним.

Chapter 6 — Database setup (Vercel Postgres) + seed
- Що зробив: Підключив репозиторій до Vercel, створив Postgres базу, додав env-змінні та виконав seed для заповнення даними.
- Скріншоти: 15, 16, 17, 18
- Питання/думки: Найважливіше — не комітити .env, бо там секрети для підключення до БД.

Chapter 8 — Static/Dynamic Rendering
- Що зробив: Зімітував повільний запит (затримка 3 сек) у fetchRevenue і побачив, що сторінка залежить від найповільнішого fetch.
- Скріншоти: 19
- Питання/думки: Dynamic rendering дає актуальні дані, але без streaming UX може сильно просідати на повільних запитах.

Chapter 9 — Streaming
- Що зробив: Додав loading.tsx із skeleton, застосував route group (overview) і розставив Suspense, щоб частини сторінки показувались раніше за повільні дані.
- Скріншоти: 20, 21, 22
- Питання/думки: Skeleton-и роблять очікування “нормальним”, а Suspense дає контроль над пріоритетом рендера.

Chapter 10 — Search & Pagination
- Що зробив: Реалізував пошук і пагінацію через URL search params, синхронізував input з URL та додав debounce, щоб не робити запит на кожен символ.
- Скріншоти: 23, 24, 25
- Питання/думки: URL-параметри зручні тим, що стан можна шарити як посилання і відновлювати після перезавантаження.

Chapter 11 — Mutating Data (Server Actions)
- Що зробив: Реалізував створення та видалення invoices через Server Actions з валідацією та revalidatePath для оновлення даних.
- Скріншоти: 26, 27
- Питання/думки: Server Actions прибирають потребу в окремих API-роутах для простих CRUD-операцій.

Chapter 12 — Error handling
- Що зробив: Додав error.tsx для “неочікуваних” помилок та/або notFound + not-found.tsx для ситуацій, коли ресурс не існує.
- Скріншоти: 28
- Питання/думки: Зручно, що помилки можна обробляти на рівні route segment і давати користувачу нормальний fallback.

Chapter 14 — Authentication
- Що зробив: Налаштував NextAuth (Credentials), захистив /dashboard через proxy та перевірив редірект на /login для неавторизованих.
- Скріншоти: 29
- Питання/думки: Proxy корисний тим, що сторінка не починає рендеритись, доки не пройде перевірка доступу.

Chapter 15 — Metadata
- Що зробив: Перемістив favicon і opengraph-image у /app, додав metadata у root layout з title.template і встановив заголовки для окремих сторінок.
- Скріншоти: 30
- Питання/думки: Metadata API економить час, бо Next.js сам формує <head> і дає нормальний шаблон для SEO та share preview.

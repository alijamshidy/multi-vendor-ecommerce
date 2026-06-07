# Multi-Vendor E-Commerce

فرانت‌اند فروشگاه چندفروشنده با **Next.js 16**، **TypeScript** و **Tailwind CSS 4**. این پروژه به یک API بک‌اند (Django REST) متصل می‌شود و از چندزبانگی (انگلیسی / فارسی با پشتیبانی RTL) و نقش‌های مختلف کاربری پشتیبانی می‌کند.

## ویژگی‌ها

- صفحه اصلی، لیست محصولات، جزئیات محصول و دسته‌بندی‌ها
- سبد خرید، تسویه‌حساب و سفارش‌ها
- احراز هویت (ورود، ثبت‌نام، بازیابی رمز عبور)
- داشبورد **مشتری**، **فروشنده** و **مدیر**
- مدیریت محصولات و دسته‌بندی‌ها (پنل ادمین / فروشنده)
- نظرات و امتیازدهی
- چندزبانگی با `next-intl` (`en` / `fa`)
- پروکسی API از طریق Route Handlerهای Next.js (`/api/v1/*`)

## پیش‌نیازها

| ابزار                          | نسخه پیشنهادی                            |
| ------------------------------ | ---------------------------------------- |
| [Node.js](https://nodejs.org/) | 20 یا بالاتر                             |
| [pnpm](https://pnpm.io/)       | 9.x (در Docker از 9.15.9 استفاده می‌شود) |
| بک‌اند Django REST             | روی پورت `8000` (پیش‌فرض)                |

> **نکته:** بدون اجرای بک‌اند، درخواست‌های API با خطای `502` یا `Unable to reach the API server` مواجه می‌شوند.

## راه‌اندازی سریع

### ۱. کلون و نصب وابستگی‌ها

```bash
git clone https://github.com/Mad-Web-team/cildur-front.git
cd cildur-front
pnpm install
```

### ۲. تنظیم متغیرهای محیطی

فایل `.env.local` در ریشه پروژه بسازید:

```env
# آدرس API برای مرورگر (same-origin proxy)
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1

# آدرس سایت (برای اشتراک‌گذاری لینک و ...)
NEXT_PUBLIC_WEBSITE_URL=http://localhost:3000

# آدرس بک‌اند برای درخواست‌های سمت سرور Next.js (اختیاری؛ پیش‌فرض: http://localhost:8000)
API_URL=http://localhost:8000

# API خارجی (اختیاری — فقط برای route داخلی /api/products)
EXTERNAL_API_URL=
EXTERNAL_API_TOKEN=
```

| متغیر                     | توضیح                                  |
| ------------------------- | -------------------------------------- |
| `NEXT_PUBLIC_API_URL`     | آدرس API که در مرورگر استفاده می‌شود   |
| `NEXT_PUBLIC_WEBSITE_URL` | URL عمومی سایت                         |
| `API_URL`                 | آدرس بک‌اند برای SSR و Route Handlerها |
| `EXTERNAL_API_URL`        | API خارجی (اختیاری)                    |
| `EXTERNAL_API_TOKEN`      | توکن Bearer برای API خارجی (اختیاری)   |

### ۳. اجرای بک‌اند

بک‌اند Django REST را روی `http://localhost:8000` اجرا کنید. این فرانت‌اند انتظار دارد API در مسیر `/api/v1/` در دسترس باشد.

### ۴. اجرای سرور توسعه

```bash
pnpm dev
```

مرورگر را باز کنید:

- انگلیسی: [http://localhost:3000/en](http://localhost:3000/en)
- فارسی: [http://localhost:3000/fa](http://localhost:3000/fa)

## دستورات npm

| دستور        | کاربرد               |
| ------------ | -------------------- |
| `pnpm dev`   | اجرای سرور توسعه     |
| `pnpm build` | ساخت نسخه production |
| `pnpm start` | اجرای نسخه build‌شده |
| `pnpm lint`  | بررسی ESLint         |

## Docker

برای اجرا با Docker Compose:

```bash
docker compose up --build
```

پیش‌فرض‌ها:

- فرانت‌اند روی پورت **3002** (`http://localhost:3002`)
- داخل کانتینر، `API_URL` به `http://host.docker.internal:8000` اشاره می‌کند (بک‌اند باید روی host اجرا باشد)

متغیرهای اختیاری در `.env`:

```env
PORT=3002
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
NEXT_PUBLIC_WEBSITE_URL=http://localhost:3002
```

## ساختار پروژه

```
app/
├── [locale]/              # مسیرهای چندزبانه
│   ├── (auth)/            # login, register, reset_password
│   └── (default)/         # صفحات اصلی فروشگاه
│       ├── admin/         # پنل مدیر
│       ├── seller/        # پنل فروشنده
│       ├── customer/      # داشبورد مشتری
│       ├── products/      # لیست و جزئیات محصول
│       ├── cart/          # سبد خرید
│       └── checkout/      # تسویه‌حساب
├── api/v1/[...path]/      # پروکسی به بک‌اند Django
components/                # کامپوننت‌های UI و صفحات
store/                     # Zustand stores (auth, cart, products, ...)
i18n/                      # تنظیمات next-intl
messages/                  # en.json, fa.json
lib/                       # axios, auth, api-proxy
proxy.ts                   # middleware: i18n + احراز هویت + نقش‌ها
```

## مسیرهای اصلی

| مسیر                           | توضیح           | دسترسی       |
| ------------------------------ | --------------- | ------------ |
| `/[locale]`                    | صفحه اصلی       | عمومی        |
| `/[locale]/products`           | لیست محصولات    | عمومی        |
| `/[locale]/products/[id]`      | جزئیات محصول    | عمومی        |
| `/[locale]/login`              | ورود            | عمومی        |
| `/[locale]/register`           | ثبت‌نام         | عمومی        |
| `/[locale]/cart`               | سبد خرید        | نیاز به ورود |
| `/[locale]/checkout`           | تسویه‌حساب      | نیاز به ورود |
| `/[locale]/customer/dashboard` | داشبورد مشتری   | مشتری        |
| `/[locale]/seller/dashboard`   | داشبورد فروشنده | فروشنده      |
| `/[locale]/admin/dashboard`    | داشبورد مدیر    | مدیر         |

## معماری API

```
مرورگر  →  /api/v1/*  →  Route Handler (Next.js)  →  Django REST (localhost:8000)
```

- در **مرورگر**، axios به `/api/v1` درخواست می‌زند (same-origin).
- در **سرور** (SSR)، مستقیماً به `API_URL` متصل می‌شود.
- توکن JWT از cookie/localStorage در header `Authorization` ارسال می‌شود.

## تکنولوژی‌ها

- **Framework:** Next.js 16 (App Router)
- **UI:** Tailwind CSS 4، Radix UI / shadcn-style components
- **State:** Zustand
- **Forms:** React Hook Form + Zod
- **HTTP:** Axios
- **i18n:** next-intl (انگلیسی / فارسی + RTL)
- **Charts:** Recharts
- **Carousel:** Embla Carousel

## عیب‌یابی

| مشکل                             | راه‌حل                                                          |
| -------------------------------- | --------------------------------------------------------------- |
| `Unable to reach the API server` | بک‌اند Django را روی پورت 8000 اجرا کنید                        |
| ریدایرکت به `/login`             | برای مسیرهای محافظت‌شده باید وارد شوید                          |
| خطای 403 در `/admin`             | فقط کاربران با نقش `admin` دسترسی دارند                         |
| API در Docker کار نمی‌کند        | `API_URL` باید `host.docker.internal:8000` باشد، نه `localhost` |

## لایسنس

پروژه خصوصی (`private: true`).

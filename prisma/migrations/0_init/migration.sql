-- CreateEnum
CREATE TYPE "AdminRole" AS ENUM ('SUPER_ADMIN', 'ADMIN', 'EDITOR', 'VIEWER');

-- CreateEnum
CREATE TYPE "ContentType" AS ENUM ('TOUR', 'ACTIVITY', 'HOTEL');

-- CreateEnum
CREATE TYPE "DestinationType" AS ENUM ('CITY', 'SITE', 'COASTAL', 'RIVER_ROUTE');

-- CreateTable
CREATE TABLE "AdminUser" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" "AdminRole" NOT NULL DEFAULT 'ADMIN',
    "permissions" JSONB,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "lastLoginAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AdminUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tour" (
    "id" TEXT NOT NULL,
    "contentType" "ContentType" NOT NULL DEFAULT 'TOUR',
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "shortDescription" TEXT NOT NULL,
    "overview" TEXT NOT NULL,
    "highlights" TEXT[],
    "duration" TEXT NOT NULL,
    "city" TEXT,
    "rating" DOUBLE PRECISION DEFAULT 0,
    "reviewCount" INTEGER DEFAULT 0,
    "groupSize" TEXT NOT NULL,
    "departurePoint" TEXT,
    "meetingPoint" TEXT,
    "languages" TEXT[],
    "priceFrom" DOUBLE PRECISION,
    "priceCurrency" TEXT NOT NULL DEFAULT 'USD',
    "included" TEXT[],
    "excluded" TEXT[],
    "itinerary" JSONB,
    "faqs" JSONB,
    "heroImage" TEXT,
    "images" TEXT[],
    "metaTitle" TEXT,
    "metaDescription" TEXT,
    "ogImage" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Tour_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Destination" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "DestinationType" NOT NULL DEFAULT 'SITE',
    "subtitle" TEXT,
    "region" TEXT,
    "heroImage" TEXT,
    "coverImage" TEXT,
    "overview" TEXT NOT NULL,
    "description" TEXT,
    "bestTime" TEXT,
    "suggestedDuration" TEXT,
    "highlights" TEXT[],
    "highlightsData" JSONB,
    "galleryImages" TEXT[],
    "metaTitle" TEXT,
    "metaDescription" TEXT,
    "ogImage" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Destination_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BlogPost" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "excerpt" TEXT NOT NULL,
    "contentText" TEXT NOT NULL DEFAULT '',
    "category" TEXT NOT NULL DEFAULT 'Travel Guide',
    "tags" TEXT[],
    "content" JSONB,
    "heroImage" TEXT,
    "metaTitle" TEXT,
    "metaDescription" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BlogPost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Inquiry" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "whatsapp" TEXT,
    "arrivalDate" TIMESTAMP(3),
    "departureDate" TIMESTAMP(3),
    "travelers" INTEGER,
    "nationality" TEXT,
    "budgetRange" TEXT,
    "hotelCategory" TEXT,
    "destinations" TEXT[],
    "tourSlug" TEXT,
    "message" TEXT,
    "internalNotes" TEXT,
    "type" TEXT NOT NULL DEFAULT 'GENERAL',
    "status" TEXT NOT NULL DEFAULT 'NEW',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Inquiry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Testimonial" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "nationality" TEXT,
    "country" TEXT,
    "rating" INTEGER NOT NULL,
    "text" TEXT NOT NULL,
    "avatarImage" TEXT,
    "source" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Testimonial_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FAQ" (
    "id" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "category" TEXT NOT NULL DEFAULT 'General',
    "order" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "FAQ_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GalleryImage" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "publicId" TEXT,
    "alt" TEXT NOT NULL,
    "title" TEXT,
    "caption" TEXT,
    "description" TEXT,
    "albumId" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GalleryImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GalleryAlbum" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "coverImage" TEXT NOT NULL,
    "coverImagePublicId" TEXT,
    "categoryId" TEXT,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GalleryAlbum_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SiteSetting" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "SiteSetting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HomepageSettings" (
    "id" TEXT NOT NULL DEFAULT 'homepage',
    "heroVisible" BOOLEAN NOT NULL DEFAULT true,
    "heroBackgroundImage" TEXT,
    "heroEyebrow" TEXT,
    "heroHeadline" TEXT,
    "heroHeadlineAccent" TEXT,
    "heroSubheadline" TEXT,
    "heroPrimaryCtaLabel" TEXT,
    "heroPrimaryCtaHref" TEXT,
    "heroSecondaryLinkLabel" TEXT,
    "heroSecondaryLinkHref" TEXT,
    "heroTrustBadges" JSONB,
    "destinationsVisible" BOOLEAN NOT NULL DEFAULT true,
    "destinationsEyebrow" TEXT,
    "destinationsHeading" TEXT,
    "destinationsHeadingAccent" TEXT,
    "destinationsViewAllLabel" TEXT,
    "destinationsViewAllHref" TEXT,
    "featuredVisible" BOOLEAN NOT NULL DEFAULT true,
    "featuredEyebrow" TEXT,
    "featuredHeading" TEXT,
    "featuredHeadingAccent" TEXT,
    "featuredDescription" TEXT,
    "featuredViewAllLabel" TEXT,
    "featuredViewAllHref" TEXT,
    "whyVisible" BOOLEAN NOT NULL DEFAULT true,
    "whyEyebrow" TEXT,
    "whyHeading" TEXT,
    "whyHeadingAccent" TEXT,
    "whyDescription" TEXT,
    "whyCtaLabel" TEXT,
    "whyCtaHref" TEXT,
    "whyCollageImage1" TEXT,
    "whyCollageImage2" TEXT,
    "whyCollageImage3" TEXT,
    "whyIncludedHeading" TEXT,
    "whyServices" JSONB,
    "ourWorldVisible" BOOLEAN NOT NULL DEFAULT true,
    "ourWorldEyebrow" TEXT,
    "ourWorldHeading" TEXT,
    "ourWorldHeadingAccent" TEXT,
    "ourWorldBody" TEXT,
    "ourWorldImage" TEXT,
    "ourWorldReadMoreLabel" TEXT,
    "ourWorldReadMoreHref" TEXT,
    "statsVisible" BOOLEAN NOT NULL DEFAULT true,
    "statsItems" JSONB,
    "statsBackgroundImage" TEXT,
    "testimonialsVisible" BOOLEAN NOT NULL DEFAULT true,
    "testimonialsEyebrow" TEXT,
    "testimonialsHeading" TEXT,
    "testimonialsHeadingAccent" TEXT,
    "finalCtaVisible" BOOLEAN NOT NULL DEFAULT true,
    "finalCtaBackgroundImage" TEXT,
    "finalCtaEyebrow" TEXT,
    "finalCtaHeading" TEXT,
    "finalCtaHeadingAccent" TEXT,
    "finalCtaDescription" TEXT,
    "finalCtaPrimaryButtonLabel" TEXT,
    "finalCtaPrimaryButtonHref" TEXT,
    "finalCtaSecondaryLinkLabel" TEXT,
    "finalCtaSecondaryLinkHref" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HomepageSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ToursListingPage" (
    "id" TEXT NOT NULL DEFAULT 'tours-listing',
    "heroBackgroundImage" TEXT,
    "heroEyebrow" TEXT,
    "heroHeading" TEXT,
    "heroSubtitle" TEXT,
    "emptyStateMessage" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ToursListingPage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DestinationsListingPage" (
    "id" TEXT NOT NULL DEFAULT 'destinations-listing',
    "heroBackgroundImage" TEXT,
    "heroEyebrow" TEXT,
    "heroHeading" TEXT,
    "heroSubtitle" TEXT,
    "emptyStateMessage" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DestinationsListingPage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AboutPage" (
    "id" TEXT NOT NULL DEFAULT 'about',
    "heroImage" TEXT,
    "heroEyebrow" TEXT,
    "heroHeading" TEXT,
    "heroSubtitle" TEXT,
    "whoEyebrow" TEXT,
    "whoHeading" TEXT,
    "whoBody" TEXT,
    "whoImage" TEXT,
    "valuesEyebrow" TEXT,
    "valuesHeading" TEXT,
    "valuesItems" JSONB,
    "statsItems" JSONB,
    "ctaBackgroundImage" TEXT,
    "ctaEyebrow" TEXT,
    "ctaHeading" TEXT,
    "ctaButtonLabel" TEXT,
    "ctaButtonHref" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AboutPage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContactPage" (
    "id" TEXT NOT NULL DEFAULT 'contact',
    "heroImage" TEXT,
    "heroEyebrow" TEXT,
    "heroHeading" TEXT,
    "heroSubtitle" TEXT,
    "whatsappIcon" TEXT,
    "whatsappLabel" TEXT,
    "whatsappSubtitle" TEXT,
    "emailIcon" TEXT,
    "emailLabel" TEXT,
    "emailSubtitle" TEXT,
    "locationIcon" TEXT,
    "locationLabel" TEXT,
    "locationSubtitle" TEXT,
    "formHeading" TEXT,
    "formSubheading" TEXT,
    "successMessage" TEXT,
    "inquiryEmailRecipient" TEXT,
    "contactMapLocation" TEXT,
    "contactMapZoom" INTEGER NOT NULL DEFAULT 12,
    "contactMapVisible" BOOLEAN NOT NULL DEFAULT true,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContactPage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GalleryPage" (
    "id" TEXT NOT NULL DEFAULT 'gallery',
    "heroImage" TEXT,
    "heroEyebrow" TEXT,
    "heroHeading" TEXT,
    "heroSubtitle" TEXT,
    "ctaHeading" TEXT,
    "ctaSubtext" TEXT,
    "ctaButtonLabel" TEXT,
    "ctaButtonHref" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GalleryPage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TripPlannerPage" (
    "id" TEXT NOT NULL DEFAULT 'trip-planner',
    "heroImage" TEXT,
    "heroEyebrow" TEXT,
    "heroHeading" TEXT,
    "heroHeadingAccent" TEXT,
    "heroSubtitle" TEXT,
    "directWhatsappLabel" TEXT,
    "stepLabels" JSONB,
    "fieldLabels" JSONB,
    "fieldPlaceholders" JSONB,
    "successRedirectMessage" TEXT,
    "whatsappMessageTemplate" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TripPlannerPage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GlobalSettings" (
    "id" TEXT NOT NULL DEFAULT 'global',
    "companyName" TEXT,
    "globalWhatsappNumber" TEXT,
    "globalPhoneNumber" TEXT,
    "globalEmail" TEXT,
    "whatsappNumber" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "address" TEXT,
    "facebookUrl" TEXT,
    "instagramUrl" TEXT,
    "tripAdvisorUrl" TEXT,
    "socialFacebook" TEXT,
    "socialInstagram" TEXT,
    "socialTripadvisor" TEXT,
    "socialTwitter" TEXT,
    "socialYoutube" TEXT,
    "siteFavicon" TEXT,
    "defaultSeoTitle" TEXT,
    "defaultSeoDescription" TEXT,
    "defaultOgImage" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GlobalSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HeaderFooter" (
    "id" TEXT NOT NULL DEFAULT 'header-footer',
    "logoImage" TEXT,
    "logoLine1" TEXT,
    "logoLine2" TEXT,
    "logoText" TEXT,
    "logoSubtitle" TEXT,
    "headerNavLinks" JSONB,
    "navLink1Label" TEXT,
    "navLink1Url" TEXT,
    "navLink2Label" TEXT,
    "navLink2Url" TEXT,
    "navLink3Label" TEXT,
    "navLink3Url" TEXT,
    "navLink4Label" TEXT,
    "navLink4Url" TEXT,
    "bookNowLabel" TEXT,
    "bookNowHref" TEXT,
    "footerTagline" TEXT,
    "footerDescription" TEXT,
    "footerCol1Heading" TEXT,
    "footerCol1Links" JSONB,
    "footerCol2Heading" TEXT,
    "footerExploreLinks" JSONB,
    "footerCopyright" TEXT,
    "footerCopyrightText" TEXT,
    "footerWhatsappLabel" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HeaderFooter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GalleryCategory" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GalleryCategory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AdminUser_email_key" ON "AdminUser"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Tour_slug_key" ON "Tour"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Destination_slug_key" ON "Destination"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "BlogPost_slug_key" ON "BlogPost"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "GalleryAlbum_slug_key" ON "GalleryAlbum"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "SiteSetting_key_key" ON "SiteSetting"("key");

-- CreateIndex
CREATE UNIQUE INDEX "GalleryCategory_slug_key" ON "GalleryCategory"("slug");

-- AddForeignKey
ALTER TABLE "GalleryImage" ADD CONSTRAINT "GalleryImage_albumId_fkey" FOREIGN KEY ("albumId") REFERENCES "GalleryAlbum"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GalleryAlbum" ADD CONSTRAINT "GalleryAlbum_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "GalleryCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

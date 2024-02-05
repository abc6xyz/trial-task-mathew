-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "address" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Wallet" (
    "id" SERIAL NOT NULL,
    "address" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "Wallet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Layout" (
    "layout_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "layout_name" TEXT NOT NULL,

    CONSTRAINT "Layout_pkey" PRIMARY KEY ("layout_id")
);

-- CreateTable
CREATE TABLE "Widget" (
    "widget_id" SERIAL NOT NULL,
    "widget_name" TEXT NOT NULL,
    "widget_description" TEXT,

    CONSTRAINT "Widget_pkey" PRIMARY KEY ("widget_id")
);

-- CreateTable
CREATE TABLE "Layout_Widgets" (
    "layout_id" INTEGER NOT NULL,
    "widget_id" INTEGER NOT NULL,
    "widget_json" JSONB NOT NULL,

    CONSTRAINT "Layout_Widgets_pkey" PRIMARY KEY ("layout_id","widget_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Wallet_address_key" ON "Wallet"("address");

-- AddForeignKey
ALTER TABLE "Wallet" ADD CONSTRAINT "Wallet_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Layout" ADD CONSTRAINT "Layout_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Layout_Widgets" ADD CONSTRAINT "Layout_Widgets_layout_id_fkey" FOREIGN KEY ("layout_id") REFERENCES "Layout"("layout_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Layout_Widgets" ADD CONSTRAINT "Layout_Widgets_widget_id_fkey" FOREIGN KEY ("widget_id") REFERENCES "Widget"("widget_id") ON DELETE CASCADE ON UPDATE CASCADE;

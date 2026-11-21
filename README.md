# Github_platform_demo

## BrightShop Storefront

A demo for BrightShop, a European retailer that sells clothes and home goods.
Spring Boot serves the static site. The cart stays in the current browser.
There is no database, payment service, or order submission.

With Java 17 or later and Maven installed, run `mvn spring-boot:run` from the
repository root. Open [http://localhost:8080](http://localhost:8080).

To see the intentional price display bug, find the Everyday Cotton Tee on the
product grid (`€19.90`). Open its detail page, select **Add to cart**, then
open **Cart**. The same unit price reads `19.90 EUR`. The sale badge also
changes from a filled pill to an outlined label. The amount does not change.
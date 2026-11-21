# BrightShop Storefront

BrightShop Storefront is a small retail demo for a fictional European seller of
clothes and home goods. It is a prop for exploring the customer journey and
discussing inconsistent practices across teams. It is not a production shop.

Spring Boot serves a static HTML, CSS, and JavaScript site. The catalog and
store information are sample data. The cart is saved in the current browser;
there is no database, account system, payment service, or order submission.
The location, history, opening times, contact details, and refund policy are
fictional. The contact details do not reach a real store.

## Requirements

For a local run:

- Java 17 or later
- Maven
- A browser with JavaScript and local storage enabled
- Internet access when Maven downloads dependencies for the first time

## Use the dev container

The [dev container](.devcontainer/devcontainer.json) provides Java 17, Maven,
Git, GitHub CLI, curl, Chromium, and the VS Code Java Extension Pack.

1. Install [Docker Desktop](https://www.docker.com/products/docker-desktop/)
   with Linux containers enabled and the
   [VS Code Dev Containers extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers).
   On Windows, use Docker Desktop's WSL 2 backend.
2. Open this repository in VS Code. Press `F1` and select
   **Dev Containers: Reopen in Container**.
3. Wait for setup to finish. It installs Chromium and builds the app.
   Internet access is required for the image, tools, and Maven dependencies.
4. In the container terminal, run `mvn spring-boot:run` and open
   [http://localhost:8080](http://localhost:8080).

The app does not start automatically. Ports 8080 and 18766 are forwarded for
the app and browser checks. After changing the container configuration, select
**Dev Containers: Rebuild Container**. The first build can take several minutes.

## Run the app

From the repository root, start the app:

```powershell
mvn spring-boot:run
```

Open [http://localhost:8080](http://localhost:8080). Press `Ctrl+C` in the
terminal to stop the server.

If port 8080 is in use, choose another port:

```powershell
mvn spring-boot:run '-Dspring-boot.run.arguments=--server.port=8081'
```

Then open [http://localhost:8081](http://localhost:8081).

## Explore the demo

- Use the category filters to browse clothes, accessories, and home goods.
- Open a product and select **Add to cart**. In the cart, use the quantity
  buttons to change or remove items.
- Use the navigation links to view the example location, store history,
  opening times, contact details, FAQ, and returns information.

The cart is stored in the browser for the current address and port. It is not
shared with another browser or device. Clearing site data clears the cart.
The checkout page is a summary only; it cannot place an order.

## Known demo inconsistency

The price format and sale badge deliberately differ between the catalog and
cart. For example, the Everyday Cotton Tee is `€19.90` on the product grid
and `19.90 EUR` in the cart. The amount is the same. See
[#2](https://github.com/oreakinodidi98/Github_platform_demo/issues/2).

## Repository structure

```text
pom.xml                                      Maven and Spring Boot configuration
.devcontainer\devcontainer.json              Development tools and forwarded ports
src\main\java\com\brightshop\
  StorefrontApplication.java                 Application entry point
src\main\resources\static\
  index.html                                 Page shell and product illustrations
  store.css                                  Storefront styles
  store.js                                   Products, page content, navigation, and cart
src\test\resources\storefront-test.html      Browser-based functional checks
.github\workflows\storefront.yml             Build and browser checks in GitHub Actions
```

To change the sample catalog or store information, edit `store.js`. Product
illustrations are SVG symbols in `index.html`; their IDs match the product IDs.
The app uses URL fragments such as `#shop` and `#cart` for navigation.

## Build and browser checks

Build the executable JAR from the repository root:

```powershell
mvn package
```

The `storefront.yml` workflow builds the app and runs the browser checks in
headless Chrome on pushes and pull requests. To run those checks locally on
Windows, build the JAR, then start a separate test server:

```powershell
java -jar target\brightshop-storefront-0.1.0-SNAPSHOT.jar --server.address=127.0.0.1 --server.port=18766 '--spring.web.resources.static-locations=file:./src/test/resources/,classpath:/static/'
```

In the dev container, use the Linux JAR path:

```bash
java -jar target/brightshop-storefront-0.1.0-SNAPSHOT.jar --server.address=127.0.0.1 --server.port=18766 '--spring.web.resources.static-locations=file:./src/test/resources/,classpath:/static/'
```

Open [http://127.0.0.1:18766/storefront-test.html](http://127.0.0.1:18766/storefront-test.html)
and check for the success message. The checks clear the cart for that server
address. Stop the test server with `Ctrl+C` when finished.

## Dependency updates

[Dependabot](.github/dependabot.yml) checks weekly for Maven dependency updates
in the root `pom.xml`, GitHub Actions updates, and Python dependency updates
in `.github/skills/powerpoint` through uv. It also checks the dev container
features for version updates. Each ecosystem has a limit of two open
version-update pull requests. The storefront has no npm dependencies or
Dockerfile, so those ecosystems are not configured.

# SocietyEaseHub

> _Manage your society with ease!_

**SocietyEaseHub** is the ultimate SaaS platform for efficient and seamless management of residential and corporate societies. Say goodbye to messy spreadsheets and endless email threads—our solution modernizes society management from finances to member access.

---

## Table of Contents

1. [Live Demo](#live-demo)
2. [Features](#features)
3. [Getting Started](#getting-started)
4. [Usage](#usage)
5. [Scripts](#scripts)
6. [Contributing](#contributing)
7. [License](#license)
8. [Author](#author)
9. [Support](#support)

---

## Live Demo

🚀 **Experience SocietyEaseHub in action!**

🔗 **[societyeasehub.vercel.app](https://societyeasehub.vercel.app)**

Try out the platform live and explore its powerful features firsthand.

---

## Features

- **Create Societies with Ease**  
  Quickly spin up new societies with a streamlined onboarding process.

- **Role-Based Access Control**  
  Assign and manage permissions easily for secure operational control.

- **Unlimited Members & Invites**  
  Scale effortlessly without limits on member count or invitations.

- **Exclusive Invite-Only Membership**  
  Maintain privacy and exclusivity with personalized member invitations.

- **Effortless Finance Management**  
  Track transactions, generate invoices, and manage budgets all in one place.

- **Strategic Roadmap Planning**  
  Visualize and plan future projects with precision.

- **Unlimited Society Meetings**  
  Host both virtual and in-person meetings to keep your members engaged.

- **Instant Announcements**  
  Broadcast important updates instantly without the hassle of missed emails.

- **Interactive Polls**  
  Quickly gather group opinions and make decisions efficiently.

- **Dynamic Channel-Based Chat**  
  Organize vibrant communication with dedicated channels for various committees or events.

- **Third-Party Integrations**  
  Seamlessly connect with external services via our JSON API.

---

## Getting Started

Follow these steps to set up SocietyEaseHub locally:

1. **Clone the Repository**

   ```bash
   git clone https://github.com/KUSHAD/societyeasehub.git
   cd societyeasehub
   ```

2. **Install Dependencies**  
   This project uses [pnpm](https://pnpm.io/) as its package manager.

   ```bash
   pnpm install
   ```

3. **Configure Environment Variables**  
   Copy the `.env.example` file to `.env` and update the required values.

4. **Initialize the Database**  
   Verify your Prisma configuration in `prisma/schema.prisma` and run:

   ```bash
   pnpm db:push
   ```

   _(Optional)_ Launch Prisma Studio for a visual interface:

   ```bash
   pnpm db:studio
   ```

5. **Start the Development Server**
   ```bash
   pnpm dev
   ```
   Open [http://localhost:3000](http://localhost:3000/) to view the application.

---

## Usage

Once the server is running, you can:

- **Create or Join a Society:**  
  Log in to create a new society or join an existing one via invite links.

- **Manage Members:**  
  Add, remove, or assign roles to society members using our robust role-based access control.

- **Plan Meetings & Announcements:**  
  Schedule meetings and broadcast real-time updates effortlessly.

- **Handle Finances:**  
  Manage dues, track expenses, and ensure financial transparency with detailed records.

- **Engage Members:**  
  Conduct interactive polls and enjoy dynamic channel-based chats to foster community engagement.

---

## Scripts

The following scripts are available via `pnpm`:

- **`dev`**:  
  Start the development server (with Turbo Mode for Next.js).

- **`build`**:  
  Build the production-ready bundle.

- **`preview`**:  
  Build and start the production server locally.

- **`start`**:  
  Run the production server (ensure you build first).

- **`db:push`**:  
  Push Prisma schema changes to your database.

- **`db:studio`**:  
  Launch Prisma Studio to manage your data visually.

- **`db:generate`**:  
  Generate the Prisma client and DBML files.

- **`lint`**:  
  Lint your codebase using ESLint.

- **`lint:fix`**:  
  Automatically fix linting errors where possible.

- **`typecheck`**:  
  Perform TypeScript checks.

- **`format:check`**:  
  Check code formatting using Prettier.

- **`format:write`**:  
  Automatically format your code with Prettier.

---

## Contributing

We welcome your contributions! To get involved:

1. **Fork the Repository**
2. **Create a New Branch**
   ```bash
   git checkout -b feature/my-new-feature
   ```
3. **Commit Your Changes**  
   Use clear, descriptive commit messages.
4. **Push to Your Branch**
   ```bash
   git push origin feature/my-new-feature
   ```
5. **Open a Pull Request**

Feel free to open an issue if you have any questions or need guidance.

---

## License

This project is licensed under the **[AGPL-3.0-only](https://www.gnu.org/licenses/agpl-3.0.en.html)**. By using or contributing to SocietyEaseHub, you agree to the terms of this license.

---

## Author

**Kushad Chakraborty**  
[Twitter](https://twitter.com/__toxic_stan_) | [Email](mailto:kushad.chakraborty@gmail.com)

---

## Support

For questions, support, or to report issues:

- Open an issue on [GitHub](https://github.com/KUSHAD/societyeasehub/issues).
- Contact the author via [email](mailto:kushad.chakraborty@gmail.com).

---

Thank you for checking out SocietyEaseHub!  
May your societies be ever organized and your members ever engaged.

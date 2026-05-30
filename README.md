# Full-Stack Meeting Scheduler Engine

A robust, self-hosted meeting scheduling application built from scratch. This engine utilizes Next.js Server Actions for secure backend computing and interfaces directly with a native local PostgreSQL instance for transaction-safe scheduling architecture.

## 🛠️ System Runtime & Architecture

This project strictly pins dependencies and runtimes to guarantee architectural reproducibility across environments.

* **Runtime Version Manager:** `asdf`
* **Backend Environment:** Node.js v24.14.0
* **Database Engine:** PostgreSQL v18.1
* **Core Framework:** Next.js v14.2.3 (App Router Architecture)
* **Database Driver:** Native `pg` connection pool client

---

## 📂 Project Structure

```text
scheduler-app/
├── .tool-versions          # Pinned system runtime versions via asdf
├── .env.local              # Local environment infrastructure secrets (Git ignored)
├── package.json            # Strict dependency locks
├── scripts/
│   └── migrate.js          # Standalone schema initialization & data seed transaction
└── src/
    ├── app/                # Next.js UI Routes & Pages
    ├── lib/
    │   └── db.ts           # PostgreSQL client pool configuration
    └── actions/
        └── bookings.ts     # Core server-side scheduling logic & validation

```


---

## 🚀 Local Development Setup

Follow these steps to reproduce the application environment on your local machine:

### 1. Clone the Repository

Click the green **Code** button, and copy the repository URL (HTTPS or SSH). Then, paste it directly into your terminal using the following commands to pull the source code down and enter the project root:

```bash
git clone <PASTE_YOUR_COPIED_GITHUB_URL_HERE>
cd scheduler-app

```

---

### 2. Prerequisites & Runtime Locks

This project mandates the use of `asdf` to govern and enforce system-level runtime parity across environments.

#### A. Core CLI Installation

If `asdf` is not yet initialized on your local architecture, execute the specific track for your operating system:

##### Track 1: Linux / Ubuntu (Native Deployment)

Pull down the stable release repository directly into your user home workspace:

```bash
# Clone the official core repository safely into a hidden home profile directory
git clone https://github.com/asdf-vm/asdf.git ~/.asdf --branch v0.15.0

```

##### Track 2: macOS (Homebrew Deployment)

If deploying onto a macOS target, leverage the native package management lifecycle:

```bash
brew install asdf

```

---

#### B. Shell Environment Integration

To guarantee the `asdf` binary layer is accessible within your execution context, append the activation scripts to your active runtime shell profile.

##### For Bash Users (`~/.bashrc`):

```bash
# Append core binary injection paths to your local profile configuration
echo '. "$HOME/.asdf/asdf.sh"' >> ~/.bashrc
echo '. "$HOME/.asdf/completions/asdf.bash"' >> ~/.bashrc

# Reload the current terminal socket to instantiate the changes
source ~/.bashrc

```

##### For Zsh Users (`~/.zshrc`):

```bash
# Append core binary injection paths to your local profile configuration
echo '. "$HOME/.asdf/asdf.sh"' >> ~/.zshrc
echo '. "$HOME/.asdf/completions/asdf.zsh"' >> ~/.zshrc

# Reload the current terminal socket to instantiate the changes
source ~/.zshrc

```

*(For alternative shells such as Fish, review the official documentation matrices at [https://asdf-vm.com](https://asdf-vm.com)).*

---

#### C. Configure and Lock the Runtimes (Node.js & PostgreSQL)

Once your local terminal successfully verifies the `asdf` command interface, navigate to the root directory of this repository and run the following execution blocks to install and pin both your execution engine and database server:

##### 1. Node.js Layer

```bash
# Add the core Node.js ecosystem runtime plugin
asdf plugin add nodejs

# Download, compile, and unpack the targeted environment version
asdf install nodejs 24.14.0

# Pin this local repository workspace to this exact version
asdf set nodejs 24.14.0

```

##### 2. PostgreSQL Database Engine Layer

```bash
# Add the PostgreSQL runtime plugin
asdf plugin add postgres

# Download and compile the database server binary
asdf install postgres 18.1

# Pin this local repository workspace to use this database engine version
asdf set postgres 18.1

# Initialize a fresh local database directory cluster (Required on first install)
pg_ctl initdb

```

---

### 3. Install Project Dependencies

Initialize a clean dependency tree by running the following command in the root directory:

```bash
npm install

```

---

### 4. Environment Configuration

Create a `.env.local` file in the root directory. This engine utilizes localized PostgreSQL credentials, bypassing default administration configurations to isolate the data layer safely:

```env
DATABASE_URL=postgresql://localhost:5432/scheduler_db

```

---

### 5. Initialize, Start, and Seed the Database

Before running database management utilities, the background engine instance must be listening on its local port socket.

```bash
# 1. Start the PostgreSQL engine background server process
pg_ctl start

# 2. Ensure the individual database storage container wrapper exists locally
createdb scheduler_db

# 3. Run the transaction-safe migration tool to build schema and insert seed data
npm run db:migrate

```

---

### 6. Fire Up the Web UI

To spin up the local development web server, run:

```bash
npm run dev

```

Open [http://localhost:3000](https://www.google.com/search?q=http://localhost:3000) in your browser to inspect the application layout.

## 🧠 Defensive Architecture Highlights

* **Absolute Path Resolution:** The data migration utility leverages Node's native `path` module to guarantee precise `.env.local` context target parsing regardless of the caller execution directory.
* **Transaction-Safe Seeding:** Database table configuration and initial data injections are wrapped inside strict SQL `BEGIN`/`COMMIT` wrappers to prevent partial database pollution if an initialization failure occurs.


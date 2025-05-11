// src/pages/Home.tsx
import { Link } from "react-router-dom";
import styles from './Home.module.css'; // Import the CSS module

export default function Home() {
  return (
    <div className={styles.container}> {/* Use container for overall padding/layout */}

      {/* --- Hero Section --- */}
      <section className={styles.hero}>
        <h1 className={styles.heroTitle}>Welcome to Smart Study Space Reservation 🚀</h1>
        <p className={styles.heroSubtitle}>Book your ideal study room quickly, easily, and efficiently.</p>
        <Link to="/rooms" className={styles.heroButton}> {/* Apply button style */}
          Find Your Space
        </Link>
      </section>

      {/* --- Features Section --- */}
      <section className={styles.features}>
        <h2 className={styles.featuresTitle}>Why Choose Us?</h2>
        <div className={styles.featuresGrid}>
          <div className={styles.featureCard}>
             {/* Add an icon here if you use an icon library e.g., <FaCheckCircle className={styles.featureIcon} /> */}
             <div className={styles.featureIcon}>✓</div> {/* Simple placeholder */}
             <h3 className={styles.featureTitle}>Easy Booking</h3>
             <p className={styles.featureDescription}>Find and reserve rooms in just a few clicks with our intuitive interface.</p>
          </div>
          <div className={styles.featureCard}>
             <div className={styles.featureIcon}>📚</div> {/* Simple placeholder */}
             <h3 className={styles.featureTitle}>Variety of Spaces</h3>
             <p className={styles.featureDescription}>Choose from individual desks, group rooms, quiet zones, and more.</p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>🕒</div> {/* Simple placeholder */}
            <h3 className={styles.featureTitle}>Real-Time Availability</h3>
            <p className={styles.featureDescription}>See instantly which rooms are available at your desired time.</p>
          </div>
        </div>
      </section>

      {/* --- How It Works Section --- */}
      <section className={styles.howItWorks}>
         <h2 className={styles.howItWorksTitle}>Get Started in 3 Simple Steps</h2>
         <div className={styles.stepsGrid}>
            <div className={styles.step}>
                <div className={styles.stepNumber}>1</div>
                <h3 className={styles.stepTitle}>Search</h3>
                <p className={styles.stepDescription}>Use filters to find rooms by date, time, size, or features.</p>
            </div>
             <div className={styles.step}>
                <div className={styles.stepNumber}>2</div>
                <h3 className={styles.stepTitle}>Select</h3>
                <p className={styles.stepDescription}>Choose the perfect room from the available options.</p>
            </div>
             <div className={styles.step}>
                <div className={styles.stepNumber}>3</div>
                <h3 className={styles.stepTitle}>Book</h3>
                <p className={styles.stepDescription}>Confirm your reservation and get ready to study!</p>
            </div>
         </div>
      </section>

      {/* You could add more sections here like testimonials or another call to action */}

    </div>
  );
}
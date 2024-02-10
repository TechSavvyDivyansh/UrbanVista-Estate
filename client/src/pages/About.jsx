import React from 'react';

const About = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-3xl p-8 bg-white rounded-lg shadow-lg text-gray-800">
        <h1 className="text-4xl font-extrabold mb-6 text-gray-900">Welcome to RealEstateHub</h1>
        <p className="text-lg text-gray-800 leading-relaxed mb-4">
          Your journey to the perfect home begins here. RealEstateHub is not just a platform; it's your gateway to a world of luxurious living.
        </p>
        <p className="text-lg text-gray-800 leading-relaxed mb-4">
          Imagine waking up to breathtaking views, enjoying the finest amenities, and making memories in a home that reflects your unique lifestyle.
          At RealEstateHub, we are committed to turning your dreams into reality.
        </p>
        <p className="text-lg text-gray-800 leading-relaxed mb-8">
          Explore our curated listings, connect with our expert team, and embark on a journey to discover the home you've always envisioned.
        </p>
        <h2 className="text-2xl font-bold mb-4 text-gray-900">Why Choose RealEstateHub?</h2>
        <ul className="list-disc pl-6 mb-8">
          <li className="text-gray-800">Exquisite Properties: Explore a collection of luxurious and unique properties.</li>
          <li className="text-gray-800">Expert Guidance: Our experienced team is here to guide you every step of the way.</li>
          <li className="text-gray-800">Modern Design: Access our platform with ease, thanks to our sleek and responsive design.</li>
          <li className="text-gray-800">Secure Transactions: Your safety is our top priority, ensuring secure transactions.</li>
        </ul>
        <p className="text-lg text-gray-800 leading-relaxed mb-8">
          RealEstateHub is not just a destination; it's an experience. Immerse yourself in the world of extraordinary living and let us be your guide.
        </p>
      </div>
    </div>
  );
};

export default About;

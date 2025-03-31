/** @type {import('next').NextConfig} */
const nextConfig = { 
    
    images: {
      domains: ["firebasestorage.googleapis.com"], // ✅ Allow Firebase Storage images
      remotePatterns: [
        {
          protocol: "https",
          hostname: "firebasestorage.googleapis.com",
          pathname: "/v0/b/**", // ✅ Match all Firebase Storage paths
        },
      ],
      
    },
  };
  
    export default nextConfig;
  /** @type {import('next').NextConfig} */
  
   
  
  
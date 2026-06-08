import { Instagram } from 'lucide-react';

const instagramPosts = [
  "https://images.unsplash.com/photo-1523398002811-999ca8dec234?w=400",
  "https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?w=400",
  "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=400",
  "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400",
  "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=400",
  "https://images.unsplash.com/photo-1562157873-818bc0726f68?w=400",
];

const InstagramFeed = () => {
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Instagram className="h-8 w-8" />
            <h2 className="text-4xl md:text-5xl font-display font-bold tracking-tight">
              @YOURSTORE
            </h2>
          </div>
          <p className="text-lg text-muted-foreground">Follow us for daily style inspiration</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {instagramPosts.map((post, idx) => (
            <a
              key={idx}
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative aspect-square overflow-hidden rounded-lg"
            >
              <img 
                src={post} 
                alt={`Instagram post ${idx + 1}`}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center">
                <Instagram className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default InstagramFeed;

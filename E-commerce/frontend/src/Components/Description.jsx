const Description = () => {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-25 py-12">
      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-8">
        <button
          className="px-8 py-4 text-red-500 font-semibold border-b-2 border-red-500 
          relative -mb-[2px] transition-colors hover:text-red-600"
        >
          Description
        </button>
        <button
          className="px-8 py-4 text-gray-500 font-semibold hover:text-gray-700
          transition-colors relative -mb-[2px] border-b-2 border-transparent hover:border-gray-200"
        >
          Reviews (122)
        </button>
      </div>

      {/* Content */}
      <div className="w-full border border-gray-200 rounded-lg p-6 bg-white shadow-sm">
        <p className="text-gray-600 leading-relaxed">
          Step into a realm of unparalleled comfort and effortless style with The Everest Oversized Hoodie. This isn't just another piece of clothing; it's a sanctuary of softness, a testament to thoughtful design, and the ultimate versatile layer for your modern wardrobe. Meticulously crafted for those who value both aesthetics and the feeling of being utterly embraced by their attire, The Everest redefines what it means to be comfortable.

From the moment you slip it on, you'll understand the difference premium quality makes. We've constructed The Everest from a heavyweight, 100% ring-spun cotton blend fleece. This isn't a flimsy fabric that loses its shape after a few wears. It's a substantial, plush material that feels luxuriously soft against your skin and provides just the right amount of warmth for crisp autumn days, chilly evenings, or air-conditioned rooms. The interior is brushed for an extra layer of cloud-like coziness, making it your immediate go-to for lounging, working from home, or running errands in style.

The design is a masterclass in minimalist elegance. We've perfected the art of the oversized fit—it’s relaxed and roomy without looking sloppy. The dropped shoulders create a contemporary silhouette that drapes beautifully, while the extended ribbed cuffs and a longer, curved hem ensure a sleek, intentional look that provides extra coverage and comfort. The spacious front pocket is not only perfect for warming your hands or storing your essentials but also adds to that classic, cozy hoodie profile.
        </p>
      </div>
    </div>
  );
};

export default Description;

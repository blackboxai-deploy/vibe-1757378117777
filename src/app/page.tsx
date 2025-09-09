import ImageGenerator from "@/components/ImageGenerator";

export default function Home() {
  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 text-white text-2xl mb-6">
            🎨
          </div>
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            AI Image Generator
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Transform your ideas into stunning visual art with the power of artificial intelligence. 
            Create unique, high-quality images from simple text descriptions.
          </p>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="text-center p-6 rounded-lg bg-white/50 backdrop-blur border">
            <div className="text-3xl mb-3">⚡</div>
            <h3 className="font-semibold mb-2">Lightning Fast</h3>
            <p className="text-sm text-gray-600">Generate images in seconds with our optimized AI models</p>
          </div>
          <div className="text-center p-6 rounded-lg bg-white/50 backdrop-blur border">
            <div className="text-3xl mb-3">🎯</div>
            <h3 className="font-semibold mb-2">High Quality</h3>
            <p className="text-sm text-gray-600">Professional-grade images with stunning detail and clarity</p>
          </div>
          <div className="text-center p-6 rounded-lg bg-white/50 backdrop-blur border">
            <div className="text-3xl mb-3">🎨</div>
            <h3 className="font-semibold mb-2">Multiple Styles</h3>
            <p className="text-sm text-gray-600">From realistic to artistic - explore various creative styles</p>
          </div>
        </div>

        {/* Main Generator */}
        <ImageGenerator />

        {/* Footer */}
        <footer className="mt-16 py-8 border-t">
          <div className="text-center text-gray-600">
            <p className="text-sm">
              Powered by advanced AI technology • Create unlimited images • No account required
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
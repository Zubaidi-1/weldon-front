export default function VerifyEmail() {
  return (
    <div className="bg-white min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md text-center space-y-6">
        {/* Title */}
        <h1 className="text-2xl sm:text-3xl md:text-4xl text-black font-semibold">
          Verify email
        </h1>

        {/* Description */}
        <p className="text-sm sm:text-base text-gray-500 leading-relaxed">
          An email has been sent to you, please verify your email to continue
        </p>

        {/* Resend */}
        <p className="text-sm sm:text-base text-gray-500">
          Haven’t received an email?{" "}
          <button className="text-[#0089d3] cursor-pointer hover:underline font-medium">
            Resend
          </button>
        </p>
      </div>
    </div>
  );
}

import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#050816] px-6 py-20">
      {/* Background glow */}
      <div className="absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#4285F4]/15 blur-[220px]" />
      </div>

      <div className="relative z-10">
        <SignIn
          appearance={{
variables: {
  colorPrimary: "#4285F4",
  colorBackground: "#0B0F24",
  colorForeground: "#FFFFFF",
  colorMutedForeground: "#A3A3A3",
  colorInput: "rgba(255,255,255,0.05)",
  colorInputForeground: "#FFFFFF",
  borderRadius: "16px",
  fontFamily: "Inter, ui-sans-serif, sans-serif",
},
            elements: {
              card: "border border-white/10 shadow-2xl backdrop-blur-xl bg-[#0B0F24]/90",
              headerTitle: "text-white",
              headerSubtitle: "text-neutral-400",
              socialButtonsBlockButton:
                "border border-white/10 bg-white/5 hover:bg-white/10 text-white",
              dividerLine: "bg-white/10",
              dividerText: "text-neutral-500",
              formFieldLabel: "text-neutral-300",
              formFieldInput:
                "border border-white/10 bg-white/5 text-white focus:border-[#4285F4]",
              formButtonPrimary:
                "bg-[#4285F4] hover:bg-[#357AE8] shadow-lg shadow-blue-500/25 text-sm normal-case",
              footerActionText: "text-neutral-400",
              footerActionLink: "text-[#7BAAF7] hover:text-[#4285F4]",
              identityPreviewText: "text-white",
              identityPreviewEditButton: "text-[#7BAAF7]",
            },
          }}
        />
      </div>
    </section>
  );
}
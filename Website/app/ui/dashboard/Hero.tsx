import { firaSansFont } from "@/app/lib/fonts";

export function Hero({ name }: { name: string }) {
  return (
    <section
      className={`hero w-fit relative z-10 h-fit ${firaSansFont.className} flex flex-col gap-2`}
    >
      <p className="w-fit h-fit text-base sm:text-lg text-black">
        Hi{" "}
        <span className="w-fit h-fit  bg-purple-800 bg-opacity-30 px-2 py-1 rounded-md">
          {name ? name : "Developer"}
        </span>
        , welcome to your own dashboard :)
      </p>
      <p className="w-fit h-fit text-neutral-800">
        There are many times when client doesn't pay you full or tells he will
        pay later and then you need to call him multiple times. Now get rod of
        that stuff. Play with the site opacity and let him get taste of his own
        medicine xD
      </p>
    </section>
  );
}

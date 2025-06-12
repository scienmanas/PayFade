export function Grid() {
  return (
    <div className="grids -z-10 absolute bg-transparent flex items-center justify-center w-full h-full overflow-clip">
      <div className="flex flex-row relative flex-wrap items-center justify-center w-full h-full">
        {Array.from({ length: 296 }).map((_, index) => (
          <div
            key={index}
            className="w-[20%] sm:w-[10%] md:w-[6.5%] lg:w-[7%] h-[10%] xl:h-[15%] border border-neutral-100"
          ></div>
        ))}
      </div>
      {/* fade overlay */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-white to-transparent" />
      <div className="pointer-events-none absolute bottom-0 h-52 right-0 w-52 bg-gradient-to-tl from-white to-transparent" />
      <div className="pointer-events-none absolute bottom-0 left-0 w-52 h-52 bg-gradient-to-tr from-white to-transparent" />
    </div>
  );
}

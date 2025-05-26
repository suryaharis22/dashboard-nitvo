
const Loading = () => {
    return (
        <div className="fixed top-0 left-0  bg-gray-500 w-screen h-screen opacity-60">

            <div class="absolute right-1/2 bottom-1/2 transform translate-x-1/2 translate-y-1/2 ">
                <div class="p-4 bg-gradient-to-tr animate-spin from-primary to-warning via-secondary rounded-full">
                    <div class="bg-gray-500 rounded-full">
                        <div class="w-24 h-24 rounded-full"></div>
                    </div>
                </div>

            </div>

        </div>

    );
}

export default Loading;

{/* <div class="flex justify-center items-center ">
                                <div class="flex items-center gap-2">

                                    <div class="text-md animate-bounce">L</div>
                                    <div class="text-md animate-bounce [animation-delay:-.3s]">o</div>
                                    <div class="text-md animate-bounce [animation-delay:-.5s]">a</div>
                                    <div class="text-md animate-bounce [animation-delay:-.7s]">d</div>
                                    <div class="text-md animate-bounce [animation-delay:-.9s]">i</div>
                                    <div class="text-md animate-bounce [animation-delay:-.11s]">n</div>
                                    <div class="text-md animate-bounce [animation-delay:-.13s]">g</div>
                                    <div class="w-2 h-2 rounded-full bg-blue-700 animate-bounce"></div>
                                    <div class="w-2 h-2 rounded-full bg-blue-700 animate-bounce [animation-delay:-.3s]"></div>
                                    <div class="w-2 h-2 rounded-full bg-blue-700 animate-bounce [animation-delay:-.5s]"></div>
                                </div>
                            </div> */}
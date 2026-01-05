const Hero = () => {
    return (
        //pb is padding bottom
        <div className="bg-blue-800 pb-16">
            {/*Container is to add spacing to the left and right of our content. mx auto is x margin automatic so the content
            is centered horizontally automatically. Use flex box col to arrange items in a column and gap 2 is to add spacing
            between child elements easily. */ }
            <div className="container mx-auto flex flex-col gap-2">
                <h1 className="text-5xl text-white font-bold"> 
                    Find your next stay
                </h1>
                <p className="text-2xl text-white">
                    Search low prices on hotels for your dream vacation...
                </p>
            </div>
        </div>
    )
}

export default Hero;
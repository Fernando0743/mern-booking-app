import Header from "../components/Header"
import Hero from "../components/Hero"
import Footer from "../components/Footer"
import SearchBar from "../components/SearchBar";

//Interface that describes Porps Layout component expects
interface Props {
    children: React.ReactNode;
}

const Layout = ({children} : Props) => {
    return(
        //Div that aligns every element in a column flexbox and that it takes the whole screen, it helps also
        //keeping the header at the top and the footer at the bottom
        <div className="flex flex-col min-h-screen">
            <Header/>
            <Hero/>
            <div className="container mx-auto">
                <SearchBar/>
            </div>
            <div className="container mx-auto py-10 flex-1">
                {children}
            </div>
            <Footer/>
        </div>
    )
}

export default Layout;
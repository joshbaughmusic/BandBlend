export const Homepage = ( {currentUserProfile} ) => {
    return (
        <>

            <section id="container_homepage" className="container">
                <section id="container_hero" className="container">
                    <header id="container_heading" className="container">
                        <h1>BandBlend</h1>
                        <h2>Fusing Musicians for Masterpieces</h2>
                    </header>
                    <div id="container_greeting" className="container">
                        <h3 id="greeting" className="greeting">Hello {currentUserProfile?.user?.name}!</h3>
                    </div>
                    <div>
                        <input type="text" /><br/>
                        <input type="text" />
                    </div>
                </section>
                <section id="container_featuredPosts" className="container">
                    <div>
                        <p>post 1</p>
                        <p>post 2</p>
                        <p>post 3</p>
                    </div>
                </section>
            </section>

        </>
    )
}
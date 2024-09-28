import React from 'react'
import  Navbar  from '../components/Navbar'
import Footer from '../components/Footer'
import { useNavigate } from 'react-router-dom';


function About() {
    var navigate= useNavigate()
    return(
        <>
        <Navbar/>
        <div className="bg-black-50 text-white lg:justify-center">

        {/* Division 1 */}
            <div className="flex xl:justify-evenly lg:flex-col xl:h-[720px] items-center">

                <div className="lg:pl-[5%] lg:h-[450px] lg:mt-[30px]">
                    <p className="xl:text-1xl lg:text-[1.1rem] xl:pb-[10px] font-poppins">A B O U T &nbsp; U S</p>
                    <p className="xl:text-5xl lg:text-2xl pb-[15px] font-bold">Empowering Dreams<br/>One heartfelt gesture<br/>& one life at a Time</p>
                    <p className="text-1xl font-inclusiveSans lg:hidden">At Marketwatch.ai, our purpose is to foster a world where compassion knows
                    <br/>no bounds. We are dedicated to creating a global community that believes
                        <br/>in the transformative power of empathy and generosity. With each heartfelt
                        <br/>donation, we build bridges between those in need and those willing to help, 
                        <br/>forging connections that transcend borders and change lives.</p>
                    
                    <p className="xl:hidden max-w-[450px] lg:text-[0.9rem] lg:pr-[5%]">At Marketwatch.ai, our purpose is to foster a world where compassion knows
                        no bounds. We are dedicated to creating a global community that believes
                        in the power of love, empathy and generosity. With each heartfelt
                        donation, we build bridges between those in need and those willing to help, 
                        forging true connections that help to transform borders & change lives of different people.</p>
                    <button className="bg-[#d5e1ffa9] mt-[25px] text-black font-semibold text-1xl w-[152px] h-[42px]"
                    onClick={()=>navigate("/signup")}>Sign up for free</button>
                </div>

                <div className="lg:h-[310px]">
                    <img src="https://res.cloudinary.com/dnq6fx1oj/image/upload/v1695540692/main-image_cambq0.webp" alt="img1"
                    className="xl:w-[500px] xl:h-[459px] lg:w-[290px] lg:h-[266px]"></img>
                </div>
            </div>

        {/* Division 2 */}
            <div className="flex-col items-center bg-[#d5e1ffa9]">

                <div className="text-black text-center xl:pt-[80px] lg:pt-[30px] pb-[30px]">
                    <p className="xl:text-1xl xl:pb-[10px] font-poppins">N E W S</p>
                    <p className="xl:text-4xl lg:text-2xl font-inclusiveSans font-semibold">Marketwatch.ai in the news</p>
                </div>

                <div className="flex items-center xl:justify-evenly lg:flex-col lg:gap-y-[30px] xl:h-[635px] lg:h-[1260px]">

                    <div className="xl:w-[335px] xl:h-[480px] bg-[#2c2929] rounded-[15px] lg:w-[270px] lg:h-[385px]
                    transition-transform transform scale-100 hover:scale-105 ">
                        <img src="https://res.cloudinary.com/dnq6fx1oj/image/upload/v1695622425/d113d94b-671d-4a0e-a613-7224742bb3d5_w1200_r1_cxvvsy.jpg" 
                            className="rounded-t-[15px]" alt="newscover"></img>
                        <div className="pl-[10%] pt-[3%] w-[80%]">
                            <p className="font-inclusiveSans font-semibold">D E C &nbsp; 2 0 ,&nbsp; 2 0 2 1</p>
                            <p className="xl:text-[1.5rem] xl:mt-[10px] lg:text-2xl font-semibold">Empowering Generosity: How Marketwatch.ai is Redefining Fundraising in the Digital Age.</p>
                        </div>
                    </div>

                    <div className="xl:w-[335px] xl:h-[460px] bg-[#2c2929] rounded-[15px] lg:w-[270px] lg:h-[385px]
                    transition-transform transform scale-100 hover:scale-105">
                        <img src="https://res.cloudinary.com/dnq6fx1oj/image/upload/v1695622425/d113d94b-671d-4a0e-a613-7224742bb3d5_w1200_r1_cxvvsy.jpg" 
                            className="rounded-t-[15px]" alt="newscover"></img>
                        <div className="pl-[10%] pt-[3%] w-[80%]">
                            <p className="font-inclusiveSans font-semibold">S E P &nbsp; 0 2 ,&nbsp; 2 0 2 2</p>
                            <p className="xl:text-[1.5rem] xl:mt-[10px] lg:text-2xl font-semibold">From Passion to Purpose - The Story Behind Marketwatch.ai, the new popular fundraiser app.</p>
                        </div>
                    </div>

                    <div className="xl:w-[335px] xl:h-[460px] bg-[#2c2929] rounded-[15px] lg:w-[270px] lg:h-[385px]
                    transition-transform transform scale-100 hover:scale-105">
                        <img src="https://res.cloudinary.com/dnq6fx1oj/image/upload/v1695622425/d113d94b-671d-4a0e-a613-7224742bb3d5_w1200_r1_cxvvsy.jpg" 
                            className="rounded-t-[15px]" alt="newscover"></img>
                        <div className="pl-[10%] pt-[3%] w-[85%]">
                            <p class    Name="font-inclusiveSans font-semibold">N O V &nbsp; 1 3 ,&nbsp; 2 0 2 2</p>
                            <p className="xl:text-[1.5rem] xl:mt-[10px] lg:text-2xl font-semibold">Hope ! Chennai flood relief in full Swing, Marketwatch.ai digitalises the campaign nationwide.</p>
                        </div>
                    </div>

                </div>
            </div>

        {/* Division 3 */}
            <div className='flex justify-evenly items-center lg:flex-col items-cente xl:h-[600px] lg:pb-[50px]'>

                <div className=''>
                    <img src='https://res.cloudinary.com/dnq6fx1oj/image/upload/v1695566490/impact-about-vision_hkmxrk.svg'
                    className='xl:w-[422px] xl:h-[426px] lg:w-[290px] lg:h-[292px]' alt='revivew'></img>
                </div>

                <div className='xl:w-[543px] xl:h-[295px] lg:w-[290px] bg-[#e7eaf1] text-black p-[2%]'>
                    <p className='zl:text-[1.2rem] lg:text-1xl font-inclusiveSans'>Overall, a very good platform for anyone trying to make a change. I have seen it be successful 
                    both as a signatory and a petition creator and features like automated emails notifying the recipient when a 
                    petition reaches milestones make the site very easy to use. It is a bit pushy about asking you to find things but 
                    it's easy to click away from and doesn't block the core functionality.</p>
                    <img src='https://res.cloudinary.com/dnq6fx1oj/image/upload/v1695566377/star_fbu9ph.png'
                    className='xl:w-[85%] lg:h-[60px]' alt='review'></img>
                </div>

            </div>

        </div>
        <Footer/>
        </>
    );
}
export default About;

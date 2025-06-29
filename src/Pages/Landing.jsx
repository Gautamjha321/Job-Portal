import { Button } from '@/components/ui/button'
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel'
import React from 'react'
import { Link } from 'react-router-dom'
import companies from '../components/Data/companies.json'
import Autoplay from 'embla-carousel-autoplay'
import { Card,  CardContent,  CardHeader, CardTitle } from '@/components/ui/card'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import faqs from '../components/Data/faq.json'


function Landing() {
  return  <main className='flex flex-col gap-10 sm:gap-20 py-10 sm:py-20' >
        
        <section className='text-center'>
          <h1 className='flex flex-col items-center justify-center gradient-title  text-4xl font-extrabold sm:text-6xl lg:text-8xl tracking-tighter py-4 ' >Find Your dreams Jobs <span className='flex items-center gap-2 sm:gap-6' >and get <img src="/logo.png" alt="Hirdd logo" className='h-14 sm:h-24 lg:h-32' /></span> </h1>
          <p className='text-gray-300 sm:mt-4 text-xs sm:text-xl'>
            Explore thousands of job listing or find the perfect candidate
          </p>
        </section>
        <div className='flex gap-6 items-center justify-center' >
          
          <Link to='/jobs' >
          <Button variant="blue"  size='xl'>Find Jobs </Button>
          
          </Link>
           <Link to='/post-job' >
          <Button variant="destructive"  size='xl' >Post a job </Button>
          
          </Link>
        </div>

        <Carousel plugins={[Autoplay({delay:2000})]} className='w-full py-10' >

          <CarouselContent className='flex gap-5 sm:gap-20 items-center' >{companies.map(({name1,id,path })=>{
            return <CarouselItem key={id}  className='basis-1/3 lg:basis-1/6' >
              <img src={path} alt={name1} className='h-9 sm:h-14 object-contain'  />
            </CarouselItem>
          })}</CarouselContent>

        </Carousel>
        {/* banner */}
        <img src="/banner.jpeg" alt="banner" />

        
       {/* card */}
        <section className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <Card>
  <CardHeader>
    <CardTitle>For Job Seakers </CardTitle>
    
  </CardHeader>
  <CardContent>
    <p>Search and apply for jobs, track application, and more </p>
  </CardContent>
 
</Card>

       <Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
   
  </CardHeader>
  <CardContent>
    <p>Card Content</p>
  </CardContent>
 
</Card>

          
        </section>

        {/* according */}

        <Accordion  type="single" collapsible className='ml-10'>
          {faqs.map((faq, index)=>{

          return (
  <AccordionItem key={index} value={`item-${index+1}`}>
    <AccordionTrigger >{faq.question}</AccordionTrigger>
    <AccordionContent >
      {faq.answer}
    </AccordionContent>
  
  </AccordionItem>
          ) })}
</Accordion>

  </main>
  
}

export default Landing
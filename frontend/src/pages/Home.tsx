
import { ArrowRight, Award, Calendar, Users } from "lucide-react"
import { Link } from "react-router-dom"
const featuredClubs = [
  {
    id: 1,
    name: 'Debate Society',
    description: 'Enhance your public speaking and critical thinking skills',
    members: 45,
    image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=800'
  },
  {
    id: 2,
    name: 'Robotics Club',
    description: 'Build and program robots for competitions',
    members: 30,
    image: 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&w=800'
  },
  {
    id: 3,
    name: 'Photography Club',
    description: 'Capture moments and learn professional photography',
    members: 35,
    image: 'https://images.unsplash.com/photo-1552168324-d612d77725e3?auto=format&fit=crop&w=800'
  }
];
const Home = () => {
  return (
    <div>
      <div className="relative w-screen h-[750px] overflow-hidden">
        {/* Background and overlay (optional) */}
        <div className="absolute inset-0 bg-gradient-to-r opacity-80">
          <img
              src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1920"
              alt="College Campus"
              className="w-full h-full object-cover"
            />
        </div>

        

        {/* Hero text overlay (optional) */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white p-4">
        <div className="text-center text-gray-700">
              <h1 className="text-5xl font-bold mb-4">Welcome to The Official TU Clubs Page</h1>
              <p className="text-xl mb-8">Discover, Connect, and Grow with Like-minded People</p>
              <Link
                to="/clubs"
                className="inline-flex items-center bg-gray-900 text-gray-400 px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Explore Clubs
                <ArrowRight className="ml-2" size={20} />
              </Link>
            </div>
        </div>
      </div>

      <section className="py-12 bg-white rounded-lg shadow-md">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">About Us</h2>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="space-y-4">
              <Users className="mx-auto text-blue-600" size={40} />
              <h3 className="text-xl font-semibold">Active Community</h3>
              <p className="text-gray-600">Join a vibrant community of over 1,000 students across various clubs and activities.</p>
            </div>
            <div className="space-y-4">
              <Calendar className="mx-auto text-blue-600" size={40} />
              <h3 className="text-xl font-semibold">Regular Events</h3>
              <p className="text-gray-600">Participate in weekly events, competitions, and workshops organized by different clubs.</p>
            </div>
            <div className="space-y-4">
              <Award className="mx-auto text-blue-600" size={40} />
              <h3 className="text-xl font-semibold">Skill Development</h3>
              <p className="text-gray-600">Enhance your skills and gain practical experience through hands-on activities.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">Featured Clubs</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {featuredClubs.map((club) => (
              <Link
                key={club.id}
                to={`/clubs/${club.id}`}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <img
                  src={club.image}
                  alt={club.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{club.name}</h3>
                  <p className="text-gray-600 mb-4">{club.description}</p>
                  <div className="flex items-center text-gray-500">
                    <Users size={16} className="mr-1" />
                    <span>{club.members} members</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">College Clubs</h3>
              <p className="text-gray-400">Empowering students to explore their interests and develop new skills through diverse club activities.</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link to="/clubs" className="text-gray-400 hover:text-white">Clubs</Link></li>
                <li><Link to="/events" className="text-gray-400 hover:text-white">Events</Link></li>
                <li><Link to="/gallery" className="text-gray-400 hover:text-white">Gallery</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Contact</h3>
              <p className="text-gray-400">Email: clubs@college.edu</p>
              <p className="text-gray-400">Phone: (555) 123-4567</p>
              <p className="text-gray-400">Location: Student Center, Room 101</p>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} College Clubs. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
    

  )
}

export default Home

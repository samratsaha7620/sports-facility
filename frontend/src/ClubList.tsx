import { Link } from 'react-router-dom';
import { Users, ChevronRight } from 'lucide-react';

const clubs = [
  {
    id: 1,
    name: 'Debate Society',
    members: 45,
    description: 'Fostering critical thinking and public speaking skills.',
    image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=800'
  },
  {
    id: 2,
    name: 'Robotics Club',
    members: 30,
    description: 'Building and programming robots for competitions.',
    image: 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&w=800'
  },
  {
    id: 3,
    name: 'Environmental Awareness',
    members: 50,
    description: 'Promoting sustainability and environmental conservation.',
    image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800'
  },
  {
    id: 4,
    name: 'Chess Club',
    members: 20,
    description: 'Enhancing strategic thinking through chess.',
    image: 'https://images.unsplash.com/photo-1529699211952-734e80c4d42b?auto=format&fit=crop&w=800'
  },
  {
    id: 5,
    name: 'Photography Club',
    members: 35,
    description: 'Exploring the art of photography and visual storytelling.',
    image: 'https://images.unsplash.com/photo-1552168324-d612d77725e3?auto=format&fit=crop&w=800'
  },
];

const ClubList = () => {
  return (
    <div className='px-10 mt-6'>
      <h2 className="text-3xl font-bold text-gray-800 mb-6">College Clubs</h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {clubs.map((club) => (
          <Link 
            key={club.id} 
            to={`/clubs/${club.id}`} 
            className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden"
          >
            <div className="h-48 overflow-hidden">
              <img
                src={club.image}
                alt={club.name}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
              />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{club.name}</h3>
              <p className="text-gray-600 mb-4">{club.description}</p>
              <div className="flex justify-between items-center text-sm text-gray-500">
                <span className="flex items-center">
                  <Users size={16} className="mr-1" />
                  {club.members} members
                </span>
                <ChevronRight size={20} />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ClubList;
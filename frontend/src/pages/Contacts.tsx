import { Mail, Phone, Globe, Linkedin, Github } from 'lucide-react';

interface StaffMember {
  id: number;
  name: string;
  role: string;
  email: string;
  phone?: string;
  photo: string;
  social?: {
    website?: string;
    linkedin?: string;
    github?: string;
  };
}

const staffMembers: StaffMember[] = [
  {
    id: 1,
    name: 'Mr. Loitongbam Basantakumar Singh',
    role: 'Assistant Professor,Department of CSE',
    email: 'lbsingh@tezu.ernet.in',
    photo: '/lbs.jpg',
    phone:"+913712275116",
    social: {
      linkedin: '',
      website: 'https://www.tezu.ernet.in/dcompsc/people/staff/teaching/home_page/lbs.html'
    }
  },
  {
    id: 2,
    name: 'Anand Sharma',
    role: 'MCA 2025,Tezpur University',
    email: 'csm22022@tezu.ac.in',
    phone: '(555) 345-6789',
    photo: '/anand.jpg',
    social: {
      linkedin: '/anand-sharma-b997371a0/',
      website: 'emilyrodriguez.com'
    }
  },
  {
    id: 3,
    name: 'Samrat Saha',
    role: 'MCA 2025,Tezpur University',
    email: 'csm22021@tezu.ac.in',
    phone: '+918017844978',
    photo: '/samrat.jpg',
    social: {
      linkedin: 'jameswilson',
      github: 'jwilson'
    }
  }
];
const Contacts = () => {
  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Our Team</h1>
          <p className="text-lg text-gray-600">Meet the dedicated staff behind our college clubs portal</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {staffMembers.map((member) => (
            <div
              key={member.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300"
            >
              <div className="relative">
                <img
                  src={member.photo}
                  alt={member.name}
                  className="w-full h-64 object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                  <h3 className="text-white text-xl font-semibold">{member.name}</h3>
                  <p className="text-gray-200 text-sm">{member.role}</p>
                </div>
              </div>

              <div className="p-4 space-y-3">
                <div className="flex items-center text-gray-600 hover:text-blue-600 transition-colors">
                  <Mail size={18} className="mr-2" />
                  <a href={`mailto:${member.email}`} className="text-sm">{member.email}</a>
                </div>
                
                <div className="flex items-center text-gray-600 hover:text-blue-600 transition-colors">
                  <Phone size={18} className="mr-2" />
                  <a href={`tel:${member.phone}`} className="text-sm">{member.phone}</a>
                </div>

                {member.social && (
                  <div className="pt-3 border-t flex justify-start space-x-4">
                    {member.social.website && (
                      <a
                        href={`https://${member.social.website}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-500 hover:text-blue-600 transition-colors"
                        title="Website"
                      >
                        <Globe size={20} />
                      </a>
                    )}
                    {member.social.linkedin && (
                      <a
                        href={`https://linkedin.com/in/${member.social.linkedin}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-500 hover:text-blue-600 transition-colors"
                        title="LinkedIn"
                      >
                        <Linkedin size={20} />
                      </a>
                    )}
                    {member.social.github && (
                      <a
                        href={`https://github.com/${member.social.github}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-500 hover:text-blue-600 transition-colors"
                        title="GitHub"
                      >
                        <Github size={20} />
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Contacts


import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Icon from "@/components/ui/icon";

const About = () => {
  const teamMembers = [
    {
      name: "Александр",
      role: "Основатель проекта",
      avatar: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      description: "Создатель и идейный вдохновитель CraftWorld. Разрабатывает стратегию развития проекта."
    },
    {
      name: "Елена",
      role: "Главный администратор",
      avatar: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      description: "Следит за порядком на серверах и координирует работу команды модераторов."
    },
    {
      name: "Михаил",
      role: "Технический специалист",
      avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      description: "Отвечает за техническую поддержку серверов и разработку плагинов."
    },
    {
      name: "Анна",
      role: "Организатор мероприятий",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      description: "Придумывает и проводит интересные игровые события и конкурсы."
    },
  ];
  
  const rules = [
    {
      category: "Общие правила",
      items: [
        "Уважайте других игроков и администрацию",
        "Запрещены оскорбления, разжигание ненависти и дискриминация",
        "Запрещено использование читов, эксплойтов и других модификаций",
        "Не спамить в чате и не флудить",
        "Реклама сторонних проектов запрещена"
      ]
    },
    {
      category: "Игровой процесс",
      items: [
        "Гриферство и намеренная порча чужих построек запрещены",
        "Кража ресурсов из чужих сундуков запрещена",
        "Запрещено создание лаг-машин и устройств, создающих нагрузку на сервер",
        "Запрещено использование ботов и программ для автоматической добычи ресурсов",
        "Территории, отмеченные как приватные, нельзя изменять без разрешения владельца"
      ]
    },
    {
      category: "Наказания",
      items: [
        "За нарушение правил может быть выдан временный бан или мут",
        "За серьезные нарушения возможен перманентный бан",
        "Администрация оставляет за собой право блокировать игроков без предупреждения",
        "Наказание может быть обжаловано через систему апелляций на форуме",
        "Незнание правил не освобождает от ответственности"
      ]
    }
  ];
  
  const serverInfo = [
    {
      icon: "Server",
      title: "Мощное оборудование",
      description: "Сервера работают на современном оборудовании с высокой пропускной способностью и защитой от DDoS-атак."
    },
    {
      icon: "Puzzle",
      title: "Уникальные плагины",
      description: "Собственные разработки, делающие игровой процесс более интересным и разнообразным."
    },
    {
      icon: "ShieldCheck",
      title: "Защита построек",
      description: "Развитая система приватов, защищающая ваши постройки от других игроков."
    },
    {
      icon: "Calendar",
      title: "Регулярные события",
      description: "Еженедельные мероприятия, соревнования и конкурсы с призами для участников."
    },
    {
      icon: "HeartHandshake",
      title: "Дружелюбное комьюнити",
      description: "Активное сообщество игроков, всегда готовое помочь новичкам."
    },
    {
      icon: "Headphones",
      title: "Круглосуточная поддержка",
      description: "Команда администраторов и модераторов, готовая помочь в любое время дня и ночи."
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="hero-section py-12 md:py-20">
        <div className="container px-4 md:px-6 text-center">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl md:text-5xl font-bold mb-4 text-white">О нашем проекте</h1>
            <p className="text-lg md:text-xl mb-6 text-gray-300">
              CraftWorld — сообщество увлеченных игроков Minecraft
            </p>
          </div>
        </div>
      </section>
      
      {/* About Section */}
      <section className="py-12 bg-background">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="md:w-1/2">
              <h2 className="text-2xl md:text-3xl font-semibold mb-4">История проекта</h2>
              <p className="text-muted-foreground mb-4">
                CraftWorld начал свою работу в 2020 году как небольшой сервер для друзей. Со временем наше сообщество росло, и сейчас
                мы предлагаем несколько серверов с различными режимами игры.
              </p>
              <p className="text-muted-foreground mb-6">
                Наша цель — создать дружелюбное и творческое пространство для всех любителей Minecraft,
                где каждый сможет найти что-то интересное для себя.
              </p>
              <div className="flex gap-4">
                <Button>
                  <Icon name="Users" size={16} className="mr-2" />
                  Присоединиться
                </Button>
                <Button variant="outline">
                  <Icon name="Discord" size={16} className="mr-2" />
                  Discord сервер
                </Button>
              </div>
            </div>
            <div className="md:w-1/2">
              <img 
                src="https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3" 
                alt="Minecraft сервер"
                className="rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Grid */}
      <section className="py-12 bg-card">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-semibold mb-2">Особенности нашего сервера</h2>
            <p className="text-muted-foreground">Почему стоит играть именно у нас</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {serverInfo.map((feature, index) => (
              <Card key={index} className="bg-secondary/50 border-primary/20">
                <CardContent className="p-6">
                  <div className="flex gap-4 items-start">
                    <div className="bg-primary/20 w-12 h-12 rounded-full flex items-center justify-center">
                      <Icon name={feature.icon} size={24} className="text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                      <p className="text-muted-foreground">{feature.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      
      {/* Team Section */}
      <section className="py-12 bg-background">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-semibold mb-2">Наша команда</h2>
            <p className="text-muted-foreground">Люди, которые делают CraftWorld лучше каждый день</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamMembers.map((member, index) => (
              <Card key={index} className="overflow-hidden">
                <div className="p-6 text-center">
                  <Avatar className="w-24 h-24 mx-auto mb-4 border-2 border-primary">
                    <AvatarImage src={member.avatar} alt={member.name} />
                    <AvatarFallback>{member.name[0]}</AvatarFallback>
                  </Avatar>
                  <h3 className="text-lg font-semibold">{member.name}</h3>
                  <p className="text-primary text-sm mb-2">{member.role}</p>
                  <Separator className="my-3" />
                  <p className="text-sm text-muted-foreground">{member.description}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
      
      {/* Rules Section */}
      <section className="py-12 bg-card">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-semibold mb-2">Правила сервера</h2>
            <p className="text-muted-foreground">Соблюдение этих правил обязательно для всех игроков</p>
          </div>
          
          <Tabs defaultValue="Общие правила" className="w-full">
            <TabsList className="grid grid-cols-3 w-full mb-6">
              {rules.map(rule => (
                <TabsTrigger key={rule.category} value={rule.category}>{rule.category}</TabsTrigger>
              ))}
            </TabsList>
            
            {rules.map(rule => (
              <TabsContent key={rule.category} value={rule.category} className="mt-0">
                <Card>
                  <CardContent className="p-6">
                    <ul className="space-y-4">
                      {rule.items.map((item, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <Icon name="Check" size={18} className="text-primary mt-1" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>
      
      {/* FAQ Section */}
      <section className="py-12 bg-background">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-semibold mb-2">Часто задаваемые вопросы</h2>
            <p className="text-muted-foreground">Ответы на популярные вопросы о нашем сервере</p>
          </div>
          
          <div className="grid gap-4 max-w-3xl mx-auto">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-2">Как начать играть на вашем сервере?</h3>
                <p className="text-muted-foreground">
                  Для начала игры вам понадобится лицензионная версия Minecraft Java Edition 1.20.4. Введите в игре IP-адрес сервера: 
                  <span className="font-minecraft ml-2 text-primary">play.craftworld.ru</span> и вы сможете начать игру.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-2">Как защитить свой дом от гриферов?</h3>
                <p className="text-muted-foreground">
                  На нашем сервере есть система приватов. Используйте команду /claim для защиты территории. Подробную инструкцию можно найти на нашем форуме.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-2">Как получить донат-привилегии?</h3>
                <p className="text-muted-foreground">
                  Вы можете приобрести различные привилегии на нашем сайте в разделе "Донат". Все средства идут на поддержку и развитие проекта.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-2">Как сообщить о нарушении правил?</h3>
                <p className="text-muted-foreground">
                  Если вы заметили нарушение правил, обратитесь к модератору или администратору на сервере. Также вы можете оставить жалобу на нашем форуме или в Discord.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      
      {/* Contact Section */}
      <section className="py-16 bg-gradient-to-r from-primary/20 to-accent/20">
        <div className="container px-4 md:px-6 text-center">
          <h2 className="text-2xl md:text-4xl font-semibold mb-4">Остались вопросы?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Свяжитесь с нами через Discord или социальные сети. Мы всегда рады помочь!
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button>
              <Icon name="Mail" size={18} className="mr-2" />
              Написать нам
            </Button>
            <Button variant="outline">
              <Icon name="MessageCircle" size={18} className="mr-2" />
              Присоединиться к Discord
            </Button>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default About;

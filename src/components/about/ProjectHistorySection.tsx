
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";

const ProjectHistorySection = () => {
  return (
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
  );
};

export default ProjectHistorySection;

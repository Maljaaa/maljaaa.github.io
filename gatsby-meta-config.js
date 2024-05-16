module.exports = {
  title: `maljaaa.github.io`,
  description: `줌코딩의 개발일기`,
  language: `ko`, // `ko`, `en` => currently support versions for Korean and English
  siteUrl: `https://maljaaa.github.io`,
  ogImage: `/og-image.png`, // Path to your in the 'static' folder
  comments: {
    utterances: {
      repo: `maljaaa/maljaaa.github.io`, // `zoomkoding/zoomkoding-gatsby-blog`,      
    },
  },
  ga: '0', // Google Analytics Tracking ID
  author: {
    name: `신승민`,
    bio: {
      role: `개발자`,
      description: ['사람에 가치를 두는', '능동적으로 일하는', '이로운 것을 만드는'],
      thumbnail: 'sample.png', // Path to the image in the 'asset' folder
    },
    social: {
      github: `https://github.com/maljaaa`, // `https://github.com/zoomKoding`,
      linkedIn: `https://www.linkedin.com/in/%EC%8A%B9%EB%AF%BC-%EC%8B%A0-383253239/`, // `https://www.linkedin.com/in/jinhyeok-jeong-800871192`,
      email: `seungmin4452@gmail.com`, // `zoomkoding@gmail.com`,
    },
  },

  // metadata for About Page
  about: {
    timestamps: [
      // =====       [Timestamp Sample and Structure]      =====
      // ===== 🚫 Don't erase this sample (여기 지우지 마세요!) =====
      {
        date: '',
        activity: '',
        links: {
          github: '',
          post: '',
          googlePlay: '',
          appStore: '',
          demo: '',
        },
      },
      // ========================================================
      // ========================================================
      {
        category: 'Career',
        date: '2024.02.19 ~ NOW',
        activity: '(주)선진 선진기술연구소 디지털혁신센터 솔루션팀',          
      },
      {
        category: 'Career',
        date: '2023.08.01 ~ 2023.08.31',
        activity: '(주)선진 선진기술연구소 디지털혁신센터 솔루션팀 - 인턴',          
      },
      {
        category: 'Career',
        date: '2022.08.01 ~ 2022.08.31',
        activity: '(주)하림 디지털혁신팀 - 인턴',        
      },
      {
        category: 'Career',
        date: '2022.01.03 ~ 2022.01.28',
        activity: '(주)선진 선진기술연구소 디지털혁신센터 솔루션팀 - 인턴',               
      },      
    ],

    projects: [
      // =====        [Project Sample and Structure]        =====
      // ===== 🚫 Don't erase this sample (여기 지우지 마세요!)  =====
      {
        title: '',
        description: '',
        techStack: ['', ''],
        thumbnailUrl: '',
        links: {
          post: '',
          github: '',
          googlePlay: '',
          appStore: '',
          demo: '',
        },
      },
      // ========================================================
      // ========================================================
      {
        title: '개발 블로그 테마 개발',
        description:
          '개발 블로그를 운영하는 기간이 조금씩 늘어나고 점점 많은 생각과 경험이 블로그에 쌓아가면서 제 이야기를 담고 있는 블로그를 직접 만들어보고 싶게 되었습니다. 그동안 여러 개발 블로그를 보면서 좋았던 부분과 불편했던 부분들을 바탕으로 레퍼런스를 참고하여 직접 블로그 테마를 만들게 되었습니다.',
        techStack: ['gatsby', 'react'],
        thumbnailUrl: 'blog.png',
        links: {
          post: '/gatsby-starter-zoomkoding-introduction',
          github: 'https://github.com/zoomkoding/zoomkoding-gatsby-blog',
          demo: 'https://www.zoomkoding.com',
        },
      },
    ],
  },
};

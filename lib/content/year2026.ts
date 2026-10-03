const year2026 = `## Self-studying 2026

*updated 3rd Oct 2026*

## Monthly updates

### September

- read through Berkley's Intro to Networking course [book](https://textbook.cs168.io/) - definitely helped me clarify on what each TCP/IP layer's role is when sending a packet. Also the sections on ARP, DNS and NAT - Definitely a resource I will refer to in the future
- read [Kubernetes and Networking](https://learning.oreilly.com/library/view/networking-and-kubernetes/9781492081647/) - learned why we moved on from iptables in k8s (i also watched [this video](https://www.youtube.com/watch?v=yOGHb2HjslY&t=1772s&pp=ygUMazhzIGlwdGFibGVz)) and chapter 2 talked through each word in the output of some of the popular linux networking commands (ping, traceroute, nmap, telnet, dig, netstat, netcat, curl)
- learned about [conntrack](https://www.markbetz.net/2023/12/12/exhausting-conntrack-table-space-crippled-our-k8s-cluster/?utm_campaign=conntrack-exhaustion-in-kubernetes-causes-and-fixes&utm_medium=referral&utm_source=newsletter.devopscube.com)
- started learning (reading the docs and playing with it in a kind cluster) about Envoy's [AgentRouter](https://theagentrouter.ai/) (previously Envoy AI Gateway)

### August

- tried to contribute a bit towards bring ADK and AgentCore memory together - [allowing an adk agent to store short-term memory in aws](https://github.com/google/adk-python/issues/6920)
- i went over the first third of the interpreter in go book but I keep re-reading the code as I believe I understand the ideas behind a lexer, parser - but if I try to implement it myself I go blank... and I want to be able to do it without AI support

### July

- finished TryHackMe's [DevSecOps](https://tryhackme-certificates.s3-eu-west-1.amazonaws.com/THM-NGEUYQDGZB.pdf) module
- finished TryHackMe's [AI Security](https://tryhackme-certificates.s3-eu-west-1.amazonaws.com/THM-7HBH15SEC3.pdf) module
- started again going over Writing an interpreter in Go (third time's the charm :D ; 1st time - I read it halfway, 2nd time - I followed along and rushed the end but understood only half, now... it's going better)
- followed along this nice guide on [How to Build Kubernetes Networking Without Kubernetes: Do What the CNI Does By Hand](https://www.freecodecamp.org/news/how-to-build-kubernetes-networking-without-kubernetes-do-what-the-cni-does-by-hand/)

### June

- read Building Generative AI Services with FastAPI
- started the Cyber Security 101 path on tryhackme

### April & May 

- Decided to learn a bit of Japanese as I found this amazing game - [Wagotabi](https://www.wagotabi.com/) - an adventure game going around actual JP prefectures, interacting with ingame characters and learning grammar/vocab (great gamified way to learn a language) + did daily Kanji studies with Tanaka san's [Kanji camps 1&2](https://japanese-tanaka-san.com/materials/kanjicamp). As Korean and Japanese are quite similar I played the game with Korean as a base language as making grammar comparisons was so much easier + there were plenty of vocab similarities which also helped me keep my Korean going as I don't speak much these days

### March

- Got my [Kubestronaut](https://www.credly.com/badges/974ab126-8d0e-4d2a-a5d2-cbc65776c5ec/linked_in_profile) title :party: (after passing KCSA and KCNA)
- started preparing for Certified Backstage Associate but doubt will take it soon - think I need a break from KodeKloud style learning
- started following [Build Your Own Kubernetes Operators with Go and Kubebuilder](https://youtu.be/odP153inZUo)
- read [Generative AI on Kubernetes](https://www.redhat.com/rhdc/managed-files/cl-oreilly-generative-ai-kubernetes-analyst-material-3188555kr-202603-en_0.pdf) - an amazing book
- vibed this new cool terminal-like personal website to use going forward - https://divakaivan.github.io/ (repo: https://github.com/divakaivan/divakaivan.github.io)

### February

- passed Certified Kubernetes Administrator exam [link](https://www.credly.com/badges/97374246-8630-463b-8991-1424b030d273)
- passed Certified Kubernetes Application Developer [link](https://www.credly.com/badges/91229755-ea37-4a9b-91eb-7c840a2fcb53)
- passed Certified Kubernetes Security Specialist [link](https://www.credly.com/badges/0c21225b-7dc7-4c4a-9525-789bb711f12f)
- almost felt like I'm over-studying after work but I'm glad I found my spots to actually rest :D
- passing CKS felt the most rewarding as it included not only K8s knowledge but general docker and linux knowledge
- next month I will do KCNA and KCSA - the last two 

### January

- signup to KodeKloud's annual sub and covered the CKA course + CKA exam series - killer.sh exam simulatios
- delayed taking a day off for the exam so will update if I passed CKA in Feb

### Initial goals:

- wrote this down at the start of Jan 2026
- become a Kubestronaut
- obtain my Stanford AI Professional Certificate
- make a cool project
`;

export default year2026;

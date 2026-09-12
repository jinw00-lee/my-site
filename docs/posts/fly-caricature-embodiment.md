---
title: A Fly Driving a Car, A Caricature of Computational Neuroscience, and Embodiment as a Constraint
date: 2026-09-12
tags: [compneuro, embodiment, simulation]
---

## Intro: A Fly Driving a Car?

Since the fruit fly connectome was completed, computational neuroscientists have started to turn its wiring diagram into neural network models. These fly-based networks have then been used in place of standard artificial neural networks for tasks such as [solving Rubik’s Cubes](https://x.com/nickwalton00/status/2098301053372621070?s=20), [playing Beat Saber](https://x.com/_lyraaaa_/status/2097527368919470162?s=20), [driving cars](https://x.com/alright_mark/status/2098085928489177142?s=20), [recognizing emotion from human speech](https://x.com/nrol_ling/status/2097349578572112280?s=20), [governing a virtual Chinese dynasty](https://x.com/ting_/status/2098353735286292815?s=20), and even [investing in stocks](https://x.com/nftechie_/status/2098012107652391357?s=20). This naturally raises a strange question: **what can a fruit fly not do?**

<XPost url="https://x.com/alright_mark/status/2098085928489177142" />

Of course, we could treat this as a funny side story. Almost no one seriously believes that a real fruit fly could perform these tasks in the real world as humans do (I believe). But if we take the issue more seriously, these examples highlight some basic problems in computational neuroscience. In this post, I discuss two of these problems based on Romain Brette’s recent book *The Brain, In Theory* (Brette, 2026), and then consider **embodiment** as a possible source of useful constraints.

---

## Problems: A Caricature of Computational Neuroscience

The confusion around “what can a fruit fly do?” points to a broader problem. Simulating a cognitive function with a neural network does not necessarily show a specific relationship between that network and that function. Brette argues that if researchers are free to define how inputs and outputs are connected to neural states, almost any network can be interpreted as implementing many different functions (pp. 61-62).

Suppose we have an arbitrary neural network $N$ that outputs $1$ for one input pattern $I_1$, and $0$ for another pattern $I_0$. Now imagine an encoder $E$ that maps a red or yellow traffic light to $I_1$, and a green light to $I_0$. We also define a decoder $D$ that interprets $1$ as “stop” and $0$ as “go.”

$$
\begin{aligned}
\text{red or yellow light} &\xrightarrow{\;E\;} I_1 \xrightarrow{\;N\;} 1 \xrightarrow{\;D\;} \text{stop} \\
\text{green light} &\xrightarrow{\;E\;} I_0 \xrightarrow{\;N\;} 0 \xrightarrow{\;D\;} \text{go}
\end{aligned}
$$

We now have a system that appears to respond correctly to traffic lights! But most of the meaningful work is already outside the network. The encoder uses the information needed to classify the traffic light, and the decoder gives the network output its behavioral meaning. By changing the original input, the final output, and the mappings $E$ and $D$, the same network $N$ could be interpreted as performing many different functions.

The fruit fly connectome can be understood in the same way. Showing that it can be used to perform a task does not tell us much about what role that connectome actually plays in the biological implementation of that function.

There is a deeper problem. What counts as the input, the output, and even the 'problem' being solved is often defined by the researcher, not by the organism.

Brette explains this with sound localization (pp.90-92). A researcher may describe the problem as follows:

$$
\underset{\text{sound at each ear}}{(s_L,\ s_R)}
\;\xrightarrow{\ \text{neural computation}\ }\;
\underset{\text{sound direction}}{\theta}
$$

This description assumes that the brain takes two auditory signals as inputs and computes the direction of the sound source. But an organism may solve the same behavioral problem without explicitly calculating any angle. It could simply turn its head toward the louder ear, receive a new pattern of sensory input, turn again, and repeat this process until the difference between the ears becomes small.

$$
\underset{\text{sensory input}}{s_t}
\to
\underset{\text{movement}}{m_t}
\to
s_{t+1}
\to
m_{t+1}
\to
\cdots
$$

From the researcher's point of view, there is still a clear relationship between the initial sensory signals and the final head direction. But the organism itself may never directly compute that mapping.

The same issue applies when a fruit fly network drives a car. Researchers decide how the visual state of the car is converted into the network input, and how neural activity is converted into steering or braking. Good driving performance therefore shows that the fly network can serve as a useful computational substrate inside an artificial interface. It does not show that the real fly nervous system solves a similar problem or uses the same computational principle.

---

## Directions: Embodiment as a Constraint

Both problems come from the high flexibility of the function defined by the researcher and the model used to implement it. If we want computational models to tell us something about how biological brains actually work, we need **additional constraints** that come from the organism itself. This is where Brette's emphasis on the *coupling between brain, body, and environment* becomes important.

For the fruit fly, the key question is not simply whether its connectome can control a car. We should instead ask what environmental variables the fly can actually sense, what actions its body can actually produce, how those actions change the environment, and how those changes create new sensory inputs. Once we remove these constraints and attach an arbitrary interface, we may stop studying the biological organization of the fly nervous system and start using its connectome as a general computational substrate.

Fortunately, computational neuroscience already includes methods that move in this direction. Tools such as *DeepLabCut* (Mathis et al., 2018) and *SLEAP* (Pereira, 2022) allow researchers to track real posture and movement in detail. This makes it possible to connect neural activity more directly to organism-level behavior rather than relying only on a small set of predefined behavioral labels.

Still, this does not fully capture brain-body-environment coupling. A stronger form of embodied modeling would also include how behavior changes the environment, and how those changes affect later sensory input and neural activity. This suggests another important direction: building ecologically valid simulation environments in which an agent with a particular body interacts with the world and with other agents. Multi-agent simulations already move in this direction (e.g., Park et al., 2023). The remaining challenge is to test whether the simulated interactions follow realistic physical and psychological constraints.

This perspective may also matter for understanding why internal representations are aligned or misaligned across biological and artificial systems. The *Platonic Representation Hypothesis* (PRH; Huh et al., 2024) suggests that different systems performing the same task well may converge on similar representational structures. In contrast, the *Umwelt Representation Hypothesis* (URH; Bosch et al., 2026) suggests that different ecological constraints may lead different systems to develop different representations.

Under the PRH view, representational misalignment may suggest that one system performs the relevant function less well than another. Under the URH view, the same misalignment may reflect different constraints rather than a simple difference in performance.

To test these ideas, we need methods that formally connect representational geometry with ecological constraints. We also need ways to separate true differences between systems from errors that come from how representational alignment is measured.

---

### References

Brette, R. (2026). *The Brain, In Theory*. Princeton, NJ: Princeton University Press.

Bosch, V., Sommers, R. P., Doerig, A., & Kietzmann, T. C. (2026). The Umwelt Representation Hypothesis: Rethinking Universality. *Trends in Cognitive Sciences*.

Huh, M., Cheung, B., Wang, T., & Isola, P. (2024). The platonic representation hypothesis. *arXiv preprint*.

Mathis, A., Mamidanna, P., Cury, K. M., Abe, T., Murthy, V. N., Mathis, M. W., & Bethge, M. (2018). DeepLabCut: Markerless pose estimation of user-defined body parts with deep learning. *Nature Neuroscience*, *21*(9), 1281–1289.

Park, J. S., O'Brien, J., Cai, C. J., Morris, M. R., Liang, P., & Bernstein, M. S. (2023, October). Generative agents: Interactive simulacra of human behavior. In *Proceedings of the 36th annual acm symposium on user interface software and technology* (pp. 1-22).

Pereira, T. D., Tabris, N., Matsliah, A., Turner, D. M., Li, J., Ravindranath, S., ... & Murthy, M. (2022). SLEAP: A deep learning system for multi-animal pose tracking. *Nature Methods*, 19(4), 486-495.
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import classes from "./App.module.scss";
import * as d3 from "d3";
import useResizeObserver from "@react-hook/resize-observer";
import {
  Slider,
  IconButton,
  ThemeProvider,
  createTheme,
  Stack,
  Toolbar,
  Box,
  Typography,
} from "@mui/material";
import { DarkModeOutlined, LightModeOutlined } from "@mui/icons-material";

const dpr = () => window.devicePixelRatio ?? 1;
const useSize = (
  target: React.MutableRefObject<HTMLElement | undefined>
): DOMRect | Record<string, never> => {
  const [size, setSize] = useState<DOMRect | Record<string, never>>({});

  useLayoutEffect(() => {
    setSize(target.current?.getBoundingClientRect() ?? {});
  }, [target]);

  useResizeObserver(
    target as unknown as React.MutableRefObject<HTMLElement>,
    (entry) => setSize(entry.contentRect)
  );
  return size;
};
function App() {
  const [white, setWhite] = useState(true);
  const containerRef = useRef<HTMLElement>();
  const sliderRef = useRef<HTMLInputElement>();
  const chargeRef =
    useRef<d3.ForceManyBody<d3.SimulationNodeDatum & { r: number }>>();
  const nodesRef = useRef<d3.SimulationNodeDatum[]>([]);

  const { width: containerWidth = 1, height: containerHeight = 1 } =
    useSize(containerRef);
  const [canvasNode, setCanvasNode] = useState<HTMLCanvasElement | null>(null);

  const [canvasS, setCanvasS] = useState<d3.Selection<
    HTMLCanvasElement,
    unknown,
    null,
    undefined
  > | null>(null);
  useEffect(() => {
    if (canvasNode) {
      setCanvasS(d3.select(canvasNode));
    }
  }, [canvasNode]);
  useEffect(() => {
    if (canvasNode && canvasS) {
      var dp = dpr();
      var width = containerWidth;
      var height = containerHeight;

      var canvas = d3
        .select(canvasNode)
        .attr("width", width * dp)
        .attr("height", height * dp);
      var context: CanvasRenderingContext2D = canvasNode.getContext(
        "2d"
      ) as CanvasRenderingContext2D;

      var blur = false;
      console.log("Q", width, height);
      let siz = Math.sqrt((width * height) / 16000000) * 5;
      const grd = siz * 20;
      nodesRef.current = d3.range(100).map((i) => ({
        r: (8 + Math.random() * 2.5) * siz,
        x: Math.random() * width,
        y: Math.random() * height,
      }));
      (nodesRef.current[0] as d3.SimulationNodeDatum & { r: number }).r =
        20 * siz;
      chargeRef.current = d3.forceManyBody().theta(1.0).strength(0);
      var simulation = d3
        .forceSimulation(nodesRef.current)
        .alphaDecay(0)
        .velocityDecay(0.05)
        .force("charge", chargeRef.current)
        .force(
          "collide",
          d3
            .forceCollide()
            .radius(
              (d) => (d as d3.SimulationNodeDatum & { r: number }).r + 2 * siz
            )
            .iterations(20)
        )
        .on("tick", () => {
          brownian();
          context.resetTransform();
          context.scale(dp, dp);
          context.fillStyle =
            blur === true
              ? white === false
                ? "rgba(0,0,0,.1)"
                : "rgba(255,255,255,.1)"
              : white === false
              ? "#4d4d4d"
              : "#fafafa";
          context.fillRect(0, 0, width, height);
          const lc = 1;
          context.lineWidth = lc;
          var brightness = white ? 255 - 27 - 27 : 77 * 2 - 104;
          var dbrightness = white ? 255 : 104;
          context.strokeStyle =
            "rgb(" + dbrightness + "," + dbrightness + "," + dbrightness + ")";

          for (var jg = grd / 2; jg < width + grd / 2; jg += grd) {
            let j = Math.floor(jg);
            context.beginPath();
            context.moveTo(j + 0.5, grd / 2);
            context.lineTo(j + 0.5, Math.round(height / grd) * grd - grd / 2);
            context.stroke();
          }
          for (var jg = grd / 2; jg < height + grd / 2; jg += grd) {
            let j = Math.floor(jg);
            context.beginPath();
            context.moveTo(grd / 2, j + 0.5);
            context.lineTo(width - grd / 2, j + 0.5);
            context.stroke();
          }
          context.strokeStyle =
            "rgb(" + brightness + "," + brightness + "," + brightness + ")";
          for (var jg = grd / 2; jg < width + grd / 2; jg += grd) {
            let j = Math.floor(jg);
            context.beginPath();
            context.moveTo(j + 0.5 - 1, grd / 2);
            context.lineTo(
              j + 0.5 - 1,
              Math.round(height / grd) * grd - grd / 2
            );
            context.stroke();
          }
          for (var jg = grd / 2; jg < height + grd / 2; jg += grd) {
            let j = Math.floor(jg);
            context.beginPath();
            context.moveTo(grd / 2, j + 0.5 - 1);
            context.lineTo(width - grd / 2, j + 0.5 - 1);
            context.stroke();
          }
          nodesRef.current.slice(0).forEach((dg, i) => {
            const d = dg as d3.SimulationNodeDatum & { r: number };
            if (d.x !== undefined && d.y !== undefined && d.r !== undefined) {
              let fC =
                i === 0
                  ? white === true
                    ? "#4d4d4d"
                    : "#fafafa"
                  : d3.schemeCategory10[i % 6];
              context.fillStyle = fC;
              context.beginPath();
              context.moveTo(d.x + d.r, d.y);
              context.arc(d.x, d.y, d.r, 0, 2 * Math.PI);
              context.fill();

              context.fillStyle = "rgba(255,255,255,0.45)";
              context.beginPath();
              context.moveTo(d.x + d.r, d.y);
              context.arc(d.x, d.y, d.r, 0, 2 * Math.PI);
              context.fill();

              context.lineWidth = 1;
              context.strokeStyle = "rgba(0,0,0,0.8)";
              context.beginPath();
              context.arc(d.x, d.y, d.r - 0.5, 0, 2 * Math.PI);
              context.stroke();

              context.save();
              context.beginPath();
              context.arc(d.x, d.y, d.r - 1, 0, 2 * Math.PI);
              context.clip();
              context.fillStyle = fC;
              context.beginPath();
              context.arc(d.x, d.y + 1, d.r - 1, 0, 2 * Math.PI);
              context.fill();
              context.restore();

              context.lineWidth = 1;
              context.strokeStyle = "rgba(255,255,255,0.32)";
              context.beginPath();
              context.arc(d.x, d.y, d.r - 0.5 - 1, 0, 2 * Math.PI);
              context.stroke();
            }
          });
        });
      function brownian() {
        let nodes = nodesRef.current;
        for (var i = 0; i < nodes.length; i++) {
          const node = nodes[i];
          if (node.x !== undefined && node.y !== undefined) {
            nodes[i].x = Math.max(Math.min(node.x, width - grd / 2), grd / 2);
            nodes[i].y = Math.max(Math.min(node.y, height - grd / 2), grd / 2);
            nodes[i].x =
              node.x * 0.9 +
              (Math.round(node.x / grd + 0.5) * grd - grd / 2) * 0.1;
            nodes[i].y =
              node.y * 0.9 +
              (Math.round(node.y / grd + 0.5) * grd - grd / 2) * 0.1;
            if (Math.random() < 0.0015) {
              nodes[i].vx = Math.random() < 0.5 ? 5 : -5;
            }
            if (Math.random() < 0.0015) {
              nodes[i].vy = Math.random() < 0.5 ? 5 : -5;
            }
          }
        }
      }
      canvas.on("mousemove", (event, d) => {
        var p1 = d3.pointer(event, canvas.node());
        nodesRef.current[0].fx = p1[0];
        nodesRef.current[0].fy = p1[1];
      });
      var charged = false;
      const dV = 200;
      canvas.on("mousedown", () => {
        charged = true;
        chargeRef.current?.strength((_, i) =>
          i == 0 ? sliderRef.current?.valueAsNumber ?? dV : 0
        );
      });
      canvas.on("mouseup", () => {
        charged = false;
        chargeRef.current?.strength(0);
      });
      // canvas.on("wheel", function (event) {
      //   var delta = -event.deltaY;
      //   if(sliderRef.current) sliderRef.current.valueAsNumber -= Math.max(-1, Math.min(1, delta)) * 10;
      //   if (charged) chargeRef.current?.strength((_, i) => i == 0 ? sliderRef.current?.valueAsNumber??dV : 0);
      // });

      function tblur() {
        blur = !blur;
      }
      return () => {
        simulation.stop();
      };
    }
  }, [containerWidth, containerHeight, canvasS, white]);
  return (
    <ThemeProvider
      theme={createTheme({ palette: { mode: white ? "light" : "dark" } })}
    >
      <div className={classes.App}>
        <Toolbar
          sx={{
            bgcolor: white === false ? "#4d4d4d" : "#fafafa",
            backgroundImage: "none",
            color: "text.primary",
          }}
        >
          <Stack direction="row" gap={2} sx={{ flex: 1 }} alignItems="center">
            <Stack direction="row" gap={1} alignItems="center">
              <Typography variant="h6">Strength</Typography>{" "}
              <Slider
                sx={{ width: "96px" }}
                min={-250}
                max={250}
                defaultValue={250}
                ref={(e) =>
                  (sliderRef.current = e?.querySelector("input") ?? undefined)
                }
              />
            </Stack>
            <Box sx={{ flex: 1 }} />
            <Stack alignItems="center" direction="row" gap={0}>
              <Typography variant="h6" component="span">
                Theme mode
              </Typography>{" "}
              <IconButton onClick={() => setWhite((v) => !v)}>
                {white ? <DarkModeOutlined /> : <LightModeOutlined />}
              </IconButton>
            </Stack>
          </Stack>
        </Toolbar>
        <div
          className={classes.canvasContainer}
          ref={(el) => (containerRef.current = el ?? undefined)}
        >
          <canvas
            ref={(node) => setCanvasNode(node)}
            className={classes.canvas}
          />
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
